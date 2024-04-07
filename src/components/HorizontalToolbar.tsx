import Toolbar from "@mui/material/Toolbar";

interface Props {
    center: { x: number; y: number };
}

function HorizontalToolbar({ center }: Props) {
    return (
        <>
            <Toolbar
                variant="dense"
                sx={{
                    backgroundColor: "rgba(255, 184, 26, 0)",
                    flexDirection: "row",
                    justifyContent: "left",
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
                        marginLeft: "-12px",
                        fontFamily: "Montserrat, sans-serif",
                        textShadow:
                            "1px 1px 0 white, -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white",
                    }}
                >
                    ({center.x}, {center.y})
                </b>
            </Toolbar>
        </>
    );
}

export default HorizontalToolbar;
