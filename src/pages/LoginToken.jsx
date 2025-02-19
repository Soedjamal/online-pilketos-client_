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
import { supabase } from "../lib/supabase.js";

const LoginToken = () => {
  const [token, setToken] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTokenSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    setError(null);

    if (!token.trim()) {
      setError("Token tidak boleh kosong!");
      setLoading(false);
      return;
    }

    try {
      if (token.slice(0, 3) == "XII") {

        // const now = new Date()
        // const day = now.getDay()
        // const hour = now.getHours()

        // if (day !== 3 || hour < 11 || hour >= 12) {
        //   setError(`Waktu pemilihan belum dimulai!, Dimulai pukul 19:00 - 21:00 WIB`);
        //   setLoading(false);
        //   return
        // }
        const { data, error: dbError } = await supabase
          .from("students_xii")
          .select("*")
          .eq("token", token)
          .single();

        if (dbError || !data) {
          setError("Token tidak valid! Periksa kembali token Anda.");
          return;
        }

        if (data.voted) {
          setError(`${data.name}, kamu sudah pernah memilih`);
          return;
        }

        localStorage.setItem("userToken", token);
        localStorage.setItem("userName", data.name);
        navigate("/input-name");
        return;
      } else {
        setError("Token tidak valid! Periksa kembali token Anda.");
      }

      if (token.slice(0, 2) == "XI") {
        const { data, error: dbError } = await supabase
          .from("students_xi")
          .select("*")
          .eq("token", token)
          .single();

        if (dbError || !data) {
          setError("Token tidak valid! Periksa kembali token Anda.");
          return;
        }

        if (data.voted) {
          setError(`${data.name}, kamu sudah pernah memilih`);
          return;
        }

        localStorage.setItem("userToken", token);
        localStorage.setItem("userName", data.name);
        navigate("/vote");
        return;
      } else {
        setError("Token tidak valid! Periksa kembali token Anda.");
      }

      if (token.slice(0, 1) == "X") {
        const { data, error: dbError } = await supabase
          .from("students_x")
          .select("*")
          .eq("token", token)
          .single();

        if (dbError || !data) {
          setError("Token tidak valid! Periksa kembali token Anda.");
          return;
        }

        if (data.voted) {
          setError(`${data.name}, kamu sudah pernah memilih`);
          return;
        }

        localStorage.setItem("userToken", token);
        localStorage.setItem("userName", data.name);
        navigate("/vote");
        return;
      } else {
        setError("Token tidak valid! Periksa kembali token Anda.");
      }

      if (token.slice(0, 2) == "TS") {
        const { data, error: dbError } = await supabase
          .from("teacher_and_staff")
          .select("*")
          .eq("token", token)
          .single();

        if (dbError || !data) {
          setError("Token tidak valid! Periksa kembali token Anda.");
          return;
        }

        if (data.voted) {
          setError(`${data.name}, kamu sudah pernah memilih`);
          return;
        }

        localStorage.setItem("userToken", token);
        localStorage.setItem("userName", data.name);
        navigate("/vote");
        return;
      } else {
        setError("Token tidak valid! Periksa kembali token Anda.");
      }
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
          onSubmit={handleTokenSubmit}
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
            Masukkan Token*
          </Typography>
          <TextField
            fullWidth
            label="Token"
            variant="outlined"
            style={{ outlineColor: "#006787" }}
            value={token}
            onChange={(e) => setToken(e.target.value)}
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

export default LoginToken;
