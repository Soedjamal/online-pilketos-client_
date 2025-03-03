import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { supabase } from "../lib/supabase";

const VotePage = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState({});
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const { data, error } = await supabase
          .from("candidates")
          .select("*")
          .order("created_at", { ascending: true });

        if (error) throw error;

        console.log("Data Kandidat:", data);
        setCandidates(data);
      } catch (err) {
        console.error("Error fetching candidates:", err);
        setError("Gagal memuat data kandidat. Coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const handleVote = async (candidateId) => {
    setSubmitLoading((prev) => ({ ...prev, [candidateId]: true }));
    const token = localStorage.getItem("userToken");

    try {
      const handleVoteForTable = async (tableName, votersTable) => {
        if (tableName == "students_xii") {
          const now = new Date();
          const day = now.getDay();
          const hour = now.getHours();

          if (day !== 5 || hour < 18 || hour >= 21) {
            setError("Waktu pemilihan belum dimulai!");
            setLoading(false);
            localStorage.removeItem("userToken");
            return;
          }
        }

        // 1. Get current user data
        const { data: userDataArray, error: userError } = await supabase
          .from(tableName)
          .select("id, name, voted, vote_version")
          .eq("token", token);

        if (userError) throw new Error("Pengguna tidak ditemukan");

        // Check if we got exactly one user
        if (!userDataArray || userDataArray.length !== 1) {
          throw new Error("Token tidak valid");
        }

        const userData = userDataArray[0];

        if (userData.voted === true) {
          setError("Kamu sudah pernah memilih");
          localStorage.removeItem("userToken");
          setTimeout(() => navigate("/"), 1200);
          return false;
        }

        // 2. Update user's voted status with version check
        const { data: updateData, error: updateError } = await supabase
          .from(tableName)
          .update({
            voted: true,
            vote_version: (userData.vote_version || 0) + 1,
          })
          .eq("id", userData.id)
          .eq("vote_version", userData.vote_version || 0)
          .select();

        if (updateError) throw updateError;

        // Check if update was successful
        if (!updateData || updateData.length === 0) {
          throw new Error(
            "Terdeteksi upaya pemilihan bersamaan. Mohon coba lagi.",
          );
        }

        // 3. Check if already voted in voters table
        const { data: votersData, error: checkError } = await supabase
          .from(votersTable)
          .select("id")
          .eq("voter_id", userData.id);

        if (checkError) throw checkError;

        // If vote already exists
        if (votersData && votersData.length > 0) {
          throw new Error("Vote ganda terdeteksi");
        }

        // 4. Increment candidate votes
        const { error: voteError } = await supabase.rpc("increment_votes", {
          candidate_id: candidateId,
        });

        if (voteError) throw voteError;

        // 5. Record in voters table
        const { error: voterError } = await supabase.from(votersTable).insert([
          {
            voter_name: userData.name,
            has_voted: candidateId,
            voter_id: userData.id,
            created_at: new Date(),
          },
        ]);

        if (voterError) throw voterError;

        return true;
      };

      let success = false;

      if (token.slice(0, 3) === "XII") {
        success = await handleVoteForTable("students_xii", "xii_voters");
      } else if (token.slice(0, 2) === "XI") {
        success = await handleVoteForTable("students_xi", "xi_voters");
      } else if (token.slice(0, 1) === "X") {
        success = await handleVoteForTable("students_x", "x_voters");
      } else if (token.slice(0, 2) === "TS") {
        success = await handleVoteForTable("teacher_and_staff", "ts_voters");
      }

      if (success) {
        setMessage("Terima kasih! Suara Anda telah tercatat.");
        localStorage.clear();
        setTimeout(() => navigate("/success"), 2000);
      }
    } catch (err) {
      console.error("Error voting:", err);
      setError(err.message || "Gagal mengirim suara, coba lagi.");
    } finally {
      setSubmitLoading((prev) => ({ ...prev, [candidateId]: false }));
      localStorage.removeItem("userToken");
    }
  };
  // Tampilkan loading saat data masih dimuat
  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
        <Typography>Memuat kandidat...</Typography>
      </Box>
    );
  }

  // Jika ada error, tampilkan pesan error
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container maxWidth="md">
      <Box textAlign="center" mt={5} marginBottom="50px">
        <Typography
          variant="h5"
          fontWeight="700"
          color="#006787"
          textAlign="center"
          marginBottom="50px"
          gutterBottom
        >
          Pilih salah satu pasangan calon ketua dan wakil ketua OSIS
        </Typography>
        {message && (
          <Alert severity="success" sx={{ mt: 2, mb: 4 }}>
            {message}
          </Alert>
        )}
        {/* Jika kandidat kosong, tampilkan pesan */}
        {candidates.length === 0 ? (
          <Typography variant="h6" color="textSecondary">
            Tidak ada kandidat yang tersedia.
          </Typography>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {candidates.map((candidate) => (
              <Grid style={{}} item xs={12} sm={6} key={candidate.id}>
                <Card
                  style={{
                    border: "2px solid rgb(220, 220, 220)",
                    borderRadius: "15px",
                  }}
                >
                  <div style={{ padding: "20px 20px 0 20px" }}>
                    <CardMedia
                      component="img"
                      height="250"
                      image={candidate.image} // Placeholder jika tidak ada gambar
                      alt={candidate.name}
                    />
                  </div>

                  <CardContent>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                      }}
                    >
                      <Typography fontWeight="700" color="" variant="subtitle2">
                        {candidate.ketua}
                      </Typography>
                      <Typography fontWeight="700" variant="subtitle2">
                        {candidate.wakil}
                      </Typography>
                    </div>

                    <Button
                      type="submit"
                      variant="outlined"
                      disabled={submitLoading[candidate.id]}
                      onClick={() => handleVote(candidate.id)}
                      sx={{ mt: 2 }}
                      style={{
                        color: "rgb(255, 255, 255)",
                        fontWeight: "700",
                        backgroundColor: "#006787",
                        padding: "15px 20px",
                        borderRadius: "10px",
                      }}
                      fullWidth
                    >
                      {submitLoading[candidate.id]
                        ? "Mengirim.."
                        : `Pilih Paslon ${candidate.paslon_ke}`}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pesan sukses */}
      </Box>
    </Container>
  );
};

export default VotePage;
