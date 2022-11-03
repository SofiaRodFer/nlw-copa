import { createContext, ReactNode, useState, useEffect } from "react";
import * as Google from 'expo-auth-session/providers/google'
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'

WebBrowser.maybeCompleteAuthSession()

interface UserProps {
    name: string;
    avatarUrl: string;
}

export interface AuthContextDataProps {
    user: UserProps;
    isUserLoading: boolean;
    signIn: () => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextDataProps)


export function AuthContextProvider({ children }: AuthProviderProps) {
    const [isUserLoading, setIsUserLoading] = useState(false)
    const [user, setUser] = useState({} as UserProps)

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: '187401252206-u3ufun8e1i7bpa6q8sk2tdnr8lm5pm10.apps.googleusercontent.com',
        redirectUri: 'https://auth.expo.io/@sofiarodfer/nlwcopamobile',
        scopes: ['profile', 'email']
    })

    async function signIn() {
        try {
            setIsUserLoading(true)

            await promptAsync()
        } catch (error) {
            console.log(error)

            throw Error
        } finally {
            setIsUserLoading(false)
        }
    }

    async function SignInWithGoogle(access_token: string) {
        console.log('TOKEN DA GOOGLE', access_token)
    }

    useEffect(() => {
        if(response?.type === 'success' && response?.authentication?.accessToken) {
            SignInWithGoogle(response.authentication.accessToken)
        }
    }, [response])

    return (
        <AuthContext.Provider value={{
            signIn,
            isUserLoading,
            user
        }}>
            { children }
        </AuthContext.Provider>
    )

}