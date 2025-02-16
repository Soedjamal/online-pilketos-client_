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
  const [submitLoading, setSubmitLoading] = useState(false);
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
    setSubmitLoading(true);
    const token = localStorage.getItem("userToken");

    try {
      if (token.slice(0, 3) == "XII") {
        // Cek pemilih berdasarkan token
        const { data: userData, error: userError } = await supabase
          .from("students_xii")
          .select("id, name")
          .eq("token", token)
          .single();

        if (userError || !userData) throw new Error("Pengguna tidak ditemukan");

        const voterId = userData.id;

        const { error: voteError } = await supabase.rpc("increment_votes", {
          candidate_id: candidateId,
        });

        if (voteError) {
          console.error("Error updating votes:", voteError);
        }

        if (voteError) throw voteError;

        const { error: voterError } = await supabase.from("xii_voters").insert([
          {
            voter_name: userData.name,
            has_voted: candidateId,
            voter_id: voterId,
            created_at: new Date(),
          },
        ]);

        if (voterError) throw voterError;

        const { error: updateError } = await supabase
          .from("students_xii")
          .update({ voted: true })
          .eq("id", voterId);

        if (updateError) throw updateError;
        setMessage("Terima kasih! Suara Anda telah tercatat.");
        localStorage.removeItem("userToken");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
        setTimeout(() => navigate("/success"), 2000);
        return;
      }

      if (token.slice(0, 2) == "XI") {
        // Cek pemilih berdasarkan token
        const { data: userData, error: userError } = await supabase
          .from("students_xi")
          .select("id, name")
          .eq("token", token)
          .single();

        if (userError || !userData) throw new Error("Pengguna tidak ditemukan");

        const voterId = userData.id;

        const { error: voteError } = await supabase.rpc("increment_votes", {
          candidate_id: candidateId,
        });

        if (voteError) {
          console.error("Error updating votes:", voteError);
        }

        if (voteError) throw voteError;

        const { error: voterError } = await supabase.from("voters").insert([
          {
            voter_name: userData.name,
            has_voted: candidateId,
            voter_id: voterId,
            created_at: new Date(),
          },
        ]);

        if (voterError) throw voterError;

        const { error: updateError } = await supabase
          .from("students_xi")
          .update({ voted: true })
          .eq("id", voterId);

        if (updateError) throw updateError;
        setMessage("Terima kasih! Suara Anda telah tercatat.");
        localStorage.removeItem("userToken");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
        setTimeout(() => navigate("/success"), 2000);
        return;
      }

      if (token.slice(0, 1) == "X") {
        // Cek pemilih berdasarkan token
        const { data: userData, error: userError } = await supabase
          .from("students_x")
          .select("id, name")
          .eq("token", token)
          .single();

        if (userError || !userData) throw new Error("Pengguna tidak ditemukan");

        const voterId = userData.id;

        const { error: voteError } = await supabase.rpc("increment_votes", {
          candidate_id: candidateId,
        });

        if (voteError) {
          console.error("Error updating votes:", voteError);
        }

        if (voteError) throw voteError;

        const { error: voterError } = await supabase.from("voters").insert([
          {
            voter_name: userData.name,
            has_voted: candidateId,
            voter_id: voterId,
            created_at: new Date(),
          },
        ]);

        if (voterError) throw voterError;

        const { error: updateError } = await supabase
          .from("students_x")
          .update({ voted: true })
          .eq("id", voterId);

        if (updateError) throw updateError;
        setMessage("Terima kasih! Suara Anda telah tercatat.");
        localStorage.removeItem("userToken");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
        setTimeout(() => navigate("/success"), 2000);
        return;
      }

      if (token.slice(0, 2) == "TS") {
        // Cek pemilih berdasarkan token
        const { data: userData, error: userError } = await supabase
          .from("teacher_and_staff")
          .select("id, name")
          .eq("token", token)
          .single();

        if (userError || !userData) throw new Error("Pengguna tidak ditemukan");

        const voterId = userData.id;
        const { error: voteError } = await supabase.rpc("increment_votes", {
          candidate_id: candidateId,
        });

        if (voteError) {
          console.error("Error updating votes:", voteError);
        }

        if (voteError) throw voteError;

        const { error: voterError } = await supabase.from("voters").insert([
          {
            voter_name: userData.name,
            has_voted: candidateId,
            voter_id: voterId,
            created_at: new Date(),
          },
        ]);

        if (voterError) throw voterError;

        const { error: updateError } = await supabase
          .from("students_x")
          .update({ voted: true })
          .eq("id", voterId);

        if (updateError) throw updateError;
        setMessage("Terima kasih! Suara Anda telah tercatat.");
        localStorage.removeItem("userToken");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
        setTimeout(() => navigate("/success"), 2000);
        return;
      }
    } catch (err) {
      console.error("Error voting:", err);
      setError("Gagal mengirim suara, coba lagi.");
    } finally {
      localStorage.removeItem("userToken");
      setSubmitLoading(false);
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
                      disabled={submitLoading}
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
                      {submitLoading
                        ? "Mengirim.."
                        : `Pilih Paslon ${candidate.paslon_ke}`}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {message && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {message}
              </Alert>
            )}
          </Grid>
        )}

        {/* Pesan sukses */}
      </Box>
    </Container>
  );
};

export default VotePage;
