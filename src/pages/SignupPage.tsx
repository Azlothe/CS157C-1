import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GoogleIcon from "@mui/icons-material/Google";
import { useState, useEffect } from "react";

function SignupPage() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        console.log(email, username, password);
    }, [email, username, password]);

    const handleSignup = async () => {
        try {
            // call signup api endpoint
            // if signup successful, redirect to canvas page
            // else handle error
        } catch (error) {
            console.error("Signup Error:", error);
        }
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
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="example@sjsu.edu"
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
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
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                onClick={handleSignup}
                            >
                                Sign up
                            </Button>
                            <Button variant="yellow" className="w-full">
                                <GoogleIcon
                                    style={{
                                        marginRight: "8px",
                                        color: "#2563EB",
                                    }}
                                />
                                Sign up with Google
                            </Button>
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
