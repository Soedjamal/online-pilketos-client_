import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { supabase } from "../lib/supabase";

const LoginNISN = () => {
  const [nisn, setNisn] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    setError(null);

    if (!nisn.trim()) {
      setError("NISN tidak boleh kosong!");
      setLoading(false);
      return;
    }

    try {
      const currentNisn = localStorage.getItem("userNISN");

      if (
        !currentNisn ||
        typeof currentNisn !== "string" ||
        currentNisn.length < 5
      ) {
        setError("NISN tidak valid atau belum tersimpan.");
        return;
      }

      if (nisn == currentNisn) {
        const { data, error: dbError } = await supabase
          .from("students_xii")
          .select("*")
          .eq("nisn", currentNisn)
          .single();

        if (dbError || !data) {
          setError("NISN tidak valid");
          return;
        }

        if (data.voted) {
          setError(`${data.name}, kamu sudah pernah memilih`);
          return;
        }
      } else {
        setError("NISN tidak sesuai dengan yang terdaftar.");
        return;
      }

      navigate("/vote");
    } catch (err) {
      setLoading(false);
      setError("Terjadi kesalahan, coba lagi.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={5}>
        <div className="img-container">
          <img
            src="https://ik.imagekit.io/nir38m3b3/Untitled%20design_20250213_090126_0000.png?updatedAt=1739412652101"
            alt=""
            style={{ width: "150px" }}
          />
        </div>
        <Typography
          variant="body1"
          marginBottom="5px"
          fontWeight="700"
          color="rgb(100, 100, 100)"
          gutterBottom
        >
          PEMILIHAN KETUA DAN WAKIL KETUA OSIS PERIODE TAHUN 2025/2026
        </Typography>
        <Typography
          variant="h6"
          marginBottom="50px"
          fontWeight="700"
          color="#006787"
          gutterBottom
        >
          SMK NEGERI 5 KENDAL
        </Typography>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "start",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="600"
            color="#404040"
            marginY="10px"
          >
            Masukkan NISN*
          </Typography>
          <TextField
            fullWidth
            label="Masukkan NISN kamu"
            variant="outlined"
            type="text"
            inputMode="numeric"
            style={{ outlineColor: "#006787" }}
            value={nisn}
            onChange={(e) => setNisn(e.target.value)}
            sx={{ mb: 2 }}
          />
          {error && (
            <Alert
              style={{ width: "90%", marginBottom: "10px" }}
              severity="error"
            >
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            variant="outlined"
            disabled={loading}
            style={{
              color: "rgb(200, 200, 200)",
              fontWeight: "700",
              backgroundColor: "#006787",
              padding: "15px 20px",
            }}
            fullWidth
          >
            {loading ? "Mengirim..." : "Kirim"}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default LoginNISN;
