import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const SuccessPage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          marginTop: "50px",
          alignItems: "center",
          padding: "0 20px",
        }}
      >
        <img
          style={{ width: "200px", height: "230px" }}
          src="https://ik.imagekit.io/nir38m3b3/20250213_174211_0000.png?updatedAt=1739443422808"
          alt=""
        />
        <Box>
          <Typography
            sx={{ fontSize: "1.5rem" }}
            variant="h4"
            fontWeight="700"
            color="#006787"
          >
            Berhasil memilih.👀
          </Typography>
          <Box sx={{ display: "flex", alignItems: "start", flexDirection: "column" }} >

            <Link style={{
              padding: "12px 35px",
              backgroundColor: "#006787",
              borderRadius: "10px",
              color: "rgb(200,200,200)",
              margin: "20px 0",
              textDecoration: "none",
              fontWeight: "700",
            }} to="/">Kembali</Link>
          </Box>

        </Box>

      </div>
      <Typography sx={{ fontSize: "1rem", textAlign: "left" }} fontWeight="500" color="rgb(130,130,130)" textAlign="center">
        "Terimakasih telah memilih"

      </Typography>

    </div>
  );
};

export default SuccessPage;

