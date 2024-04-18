import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import GoogleIcon from "@mui/icons-material/Google";
import SJSU from "../assets/sjsu.png";
import SpartanDraw from "/spartandraw.svg";
import { auth, provider } from "../services/FirebaseService";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const data = await signInWithPopup(auth, provider); // authenticates the current user
            const email = data.user.email;

            // TODO: check if user already exists in database
            // if so, navigate to /canvas page
            // else log out and navigate to /signup page
            auth.signOut();
            navigate("/signup");
        } catch (error) {
            console.error("Login Error:", error);
        }
    };

    return (
        <>
            <div className="min-h-screen grid lg:grid-cols-2">
                <div className="flex items-center justify-center py-12">
                    <div className="mx-auto grid w-[350px] gap-6">
                        <div className="grid gap-2 text-center">
                            <h1 className="text-3xl font-bold">Log in</h1>
                        </div>
                        <div className="grid gap-4">
                            {/* <div className="grid gap-2">
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
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                onClick={handleLogin}
                            >
                                Log in
                            </Button> */}
                            <Button
                                variant="yellow"
                                className="w-full"
                                onClick={handleLogin}
                            >
                                <GoogleIcon
                                    style={{
                                        marginRight: "8px",
                                        color: "#2563EB",
                                    }}
                                />
                                Log in with Google
                            </Button>
                        </div>
                        <div className="text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <a href="/signup" className="underline">
                                Sign up
                            </a>
                        </div>
                    </div>
                </div>
                <div className="hidden bg-muted lg:block">
                    <div className="relative h-full">
                        <img
                            src={SJSU}
                            alt="Image"
                            width="1600px"
                            height="1200px"
                            className="h-full w-full object-cover"
                        />
                        <img
                            src={SpartanDraw}
                            alt="Image"
                            width="50%"
                            height="50%"
                            className="absolute top-0 left-0 right-0 object-cover bottom-0 mx-auto my-auto filter drop-shadow-2xl animate-wiggle"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginPage;
