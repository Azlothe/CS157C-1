import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GoogleIcon from "@mui/icons-material/Google";
import { useState } from "react";
import { auth, provider } from "../services/FirebaseService";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

function SignupPage() {
    const [username, setUsername] = useState<string>("");

    const navigate = useNavigate();

    const handleSignup = () => {
        signInWithPopup(auth, provider)
            .then((data) => {
                const email = data.user.email;

                // TODO: save user email and username to database

                if (email && username) navigate("/canvas");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <>
            <div className="flex items-center justify-center min-h-screen">
                <Card className="mx-auto w-[350px]">
                    <CardHeader className="text-center">
                        <h1 className="text-3xl font-bold">Sign up</h1>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    required
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                />
                            </div>
                            {username ? (
                                <Button
                                    variant="yellow"
                                    className="w-full"
                                    onClick={handleSignup}
                                >
                                    <GoogleIcon
                                        style={{
                                            marginRight: "8px",
                                            color: "#2563EB",
                                        }}
                                    />
                                    Sign up with Google
                                </Button>
                            ) : (
                                <Button
                                    disabled
                                    variant="yellow"
                                    className="w-full"
                                >
                                    <GoogleIcon
                                        style={{
                                            marginRight: "8px",
                                            color: "#2563EB",
                                        }}
                                    />
                                    Sign up with Google
                                </Button>
                            )}
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <a href="/login" className="underline">
                                Log in
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

export default SignupPage;
