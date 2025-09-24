import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { LogIn, Images } from 'lucide-react';
import camera from '../assets/camera.jpg';
import { auth, loginWithGoogle } from "../firebase";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";


// Update the component
const Login = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  useEffect(()=> {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) =>{
        setUser(currentUser);
        if (currentUser) navigate("/home")
    });
    return () => unsubscribe();
    }, [navigate]);  

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
      setLoading(false);
    }
  };



  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url('${camera}')`
      }}
    >
      {/* Background overlay for better readability */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>

      <header className='relative container mx-auto px-4 py-6'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2 ml-10' onClick={() => navigate('/')}>
                    <Images className='h-8 w-8 text-slate-50'/>
                    <span className='text-2xl font-bold text-slate-50'>PhotoAlbums</span>
                </div>
            </div>
        </header>
        

      {/* Main Content */}
      <main className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto mb-6 p-4 bg-blue-100/20 backdrop-blur-sm rounded-full w-fit border border-white/30">
                  <LogIn className="h-12 w-12 text-blue-200" />
                </div>
                <CardTitle className="text-3xl text-white mb-2">Sign In</CardTitle>
                <CardDescription className="text-white/80 text-lg">
                  Access your photo albums and start exploring amazing memories
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full bg-blue-500/90 hover:bg-blue-600/90 backdrop-blur-sm border border-white/20 text-white shadow-lg transition-all duration-300"
                  size="lg"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  ) : (
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  {loading ? "Signing in..." : "Continue with Google"}
                </Button>
                
                <div className="text-center space-y-2">
                  <p className="text-white/60 text-sm">
                    Secure authentication powered by Google
                  </p>
                  <p className="text-white/40 text-xs">
                    By signing in, you agree to our Terms of Service and Privacy Policy
                  </p>
                  <a href="/" className="text-slate-50 text-xs underline">Go back home </a>
                </div>
              </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
};

export default Login;