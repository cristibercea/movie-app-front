import React, { useCallback, useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import {
    IonBadge,
    IonButton, IonCard, IonCardContent,
    IonCardHeader, IonCardTitle, IonContent, IonHeader, IonInput, IonLoading, IonPage, IonTitle,
    IonToast, IonToolbar
} from '@ionic/react';
import { AuthContext } from './AuthProvider';
import { getLogger } from '../core';
import {Network} from "@capacitor/network";

const log = getLogger('Login');

interface LoginState {
    username?: string;
    password?: string;
}

export const Login: React.FC<RouteComponentProps> = ({ history }) => {
    const { isAuthenticated, isAuthenticating, login, authenticationError } = useContext(AuthContext);
    const [state, setState] = useState<LoginState>({});
    const { username, password } = state;
    const [isOnline, setIsOnline] = useState<boolean>(true);
    const [showToast, setShowToast] = useState<boolean>(false);

    useEffect(() => {
        let listener: any;

        const setupNetworkListener = async () => {
            const status = await Network.getStatus();
            setIsOnline(status.connected);

            listener = await Network.addListener('networkStatusChange', (status) => {
                setIsOnline(status.connected);
                setShowToast(true);
            });
        };

        setupNetworkListener();

        return () => {
            if (listener && typeof listener.remove === 'function') {
                listener.remove();
            }
        };
    }, []);
    const handlePasswwordChange = useCallback((e: any) => setState({
        ...state,
        password: e.detail.value || ''
    }), [state]);
    const handleUsernameChange = useCallback((e: any) => setState({
        ...state,
        username: e.detail.value || ''
    }), [state]);
    const handleLogin = useCallback(() => {
        log('handleLogin...');
        login?.(username, password);
    }, [login, username, password]); //////////////////////
    log('render');
    useEffect(() => {
        if (isAuthenticated) {
            log('redirecting to home');
            history.push('/');
        }
    }, [history, isAuthenticated]); ////////////////////
    return (
        <IonPage>
            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                color={isOnline ? 'success' : 'danger'}
                message={isOnline ? 'You are back online!' : 'You are offline!'}
                duration={1500}
                position="bottom"
            />
            <IonHeader translucent={true}>
                <IonToolbar>
                    <IonTitle>
                        Login
                        <IonBadge
                            color={isOnline ? 'success' : 'danger'}
                            style={{ marginLeft: '10px', verticalAlign: 'middle' }}
                        >
                            {isOnline ? 'Online' : 'Offline'}
                        </IonBadge>
                    </IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className="ion-padding ion-text-center">
                <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%'}}>
                    <IonCard style={{ maxWidth: 400, width: '100%' }}>
                        <IonCardHeader><IonCardTitle>Welcome Back</IonCardTitle></IonCardHeader>
                        <IonCardContent>
                            <IonInput
                                label="Username"
                                labelPlacement="floating"
                                placeholder="Enter your username"
                                value={username}
                                onIonChange={handleUsernameChange}
                                fill="outline"
                                className="ion-margin-bottom"
                            />
                            <IonInput
                                label="Password"
                                labelPlacement="floating"
                                placeholder="Enter your password"
                                type="password"
                                value={password}
                                onIonChange={handlePasswwordChange}
                                fill="outline"
                                className="ion-margin-bottom"
                            />
                            <IonLoading isOpen={isAuthenticating} />
                            {authenticationError && (
                                <div style={{ color: 'var(--ion-color-danger)', marginTop: 12 }}>
                                    {authenticationError.message || 'Failed to authenticate'}
                                </div>
                            )}
                            <IonButton expand="block" onClick={handleLogin} className="ion-margin-top">Login</IonButton>
                        </IonCardContent>
                    </IonCard>
                </div>
            </IonContent>
        </IonPage>
    );
};
