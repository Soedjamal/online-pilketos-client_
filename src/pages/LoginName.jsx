import { useEffect, useState } from "react";
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

const LoginName = () => {
  const [name, setName] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const crrName = localStorage.getItem("userName");
    setCurrentName(crrName);
  }, []);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Nama tidak boleh kosong!");
      setLoading(false);
      return;
    }

    try {
      if (name.slice(-5) !== currentName.slice(-5)) {
        setError("Nama tidak valid");
        return;
      }

      // Query data siswa XII
      const { data, error: dbError } = await supabase
        .from("students_xii")
        .select("*")
        .ilike("name", `%${name.trim()}%`)
        .single();

      // Handle error atau data tidak ditemukan
      if (dbError || !data) {
        setError("Nama tidak terdaftar!");
        return;
      }

      // Cek status voted
      if (data.voted) {
        setError(`${data.name}, kamu sudah pernah memilih`);
        return;
      }

      // Simpan data ke localStorage jika diperlukan
      localStorage.setItem("userId", data.id);

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
            Masukkan Nama Lengkap*
          </Typography>
          <TextField
            fullWidth
            label="Contoh Penulisan: Fulana Binti Fulan"
            variant="outlined"
            style={{ outlineColor: "#006787" }}
            value={name}
            onChange={(e) => setName(e.target.value)}
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

export default LoginName;
