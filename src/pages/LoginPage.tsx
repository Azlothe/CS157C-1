import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GoogleIcon from "@mui/icons-material/Google";

function LoginPage() {
    return (
        <>
            <div className="min-h-screen grid grid-cols-2">
                <div className="flex items-center justify-center py-12">
                    <div className="mx-auto grid w-[350px] gap-6">
                        <div className="grid gap-2 text-center">
                            <h1 className="text-3xl font-bold">Log in</h1>
                        </div>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="example@sjsu.edu"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input id="password" type="password" required />
                            </div>
                            <Button type="submit" className="w-full">
                                Log in
                            </Button>
                            <Button variant="outline" className="w-full">
                                <GoogleIcon style={{ marginRight: "8px", color: "#2563EB" }} />
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
                    {/* <Image
                    src="/placeholder.svg"
                    alt="Image"
                    width="1920"
                    height="1080"
                    className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                /> */}
                </div>
            </div>
        </>
    );
}

export default LoginPage;
