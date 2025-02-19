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
          gap: "10px",
          marginTop: "50px",
          alignItems: "center",
          padding: "0 20px",
        }}
      >
        <img
          style={{ width: "180px", height: "200px" }}
          src="https://ik.imagekit.io/nir38m3b3/20250213_174211_0000.png?updatedAt=1739443422808"
          alt=""
        />
        <Box>
          <Typography
            style={
              {
                // border: "1px solid black",
              }
            }
            variant="h4"
            fontWeight="700"
            color="#006787"
          >
            Berhasil memilih.👀
          </Typography>
          <Box sx={{ display: "flex", alignItems: "start", flexDirection: "column" }} >
            <Typography sx={{ fontSize: "1.2rem", mt: 3 }} fontWeight="500" color="rgb(130,130,130)" textAlign="center">
              "Terimakasih telah memilih"

            </Typography>
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

    </div>
  );
};

export default SuccessPage;

