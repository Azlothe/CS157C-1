import Toolbar from "@mui/material/Toolbar";
import { Button } from "@/components/ui/button";

interface Props {
    center: { x: number; y: number };
}

function HorizontalToolbar({ center }: Props) {
    const handleLogout = async () => {
        try {
            // call logout api endpoint
            // if logout successful, redirect to home page
            // else handle error
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    return (
        <>
            <Toolbar
                sx={{
                    backgroundColor: "rgba(255, 184, 26, 0)",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100vw",
                    position: "fixed",
                    top: "0px",
                    left: "0px",
                    color: "#121212",
                }}
            >
                <b
                    style={{
                        display: "block",
                        marginLeft: "-12px",
                        fontFamily: "Montserrat, sans-serif",
                        textShadow:
                            "1px 1px 0 white, -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white",
                    }}
                >
                    ({center.x}, {center.y})
                </b>
                <Button className="mr-[-12px]" onClick={handleLogout}>
                    Log out
                </Button>
            </Toolbar>
        </>
    );
}

export default HorizontalToolbar;
