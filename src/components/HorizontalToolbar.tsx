import Toolbar from "@mui/material/Toolbar";
import { Button } from "@/components/ui/button";
import { auth } from "../services/FirebaseService";
import { useNavigate } from "react-router-dom";
import { getEmail } from "../context/AuthContext.ts";
import { useEffect, useState } from "react";

interface Props {
    center: { x: number; y: number };
}

function HorizontalToolbar({ center }: Props) {
    const [email, setEmail] = useState("");

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            console.log("Logged out");
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const userEmail: string = (await getEmail()) as string;
                setEmail(userEmail);
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

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
                    {email ? ("Log out") : ("Go back")}
                </Button>
            </Toolbar>
        </>
    );
}

export default HorizontalToolbar;
