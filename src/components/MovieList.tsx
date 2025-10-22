import React, {useContext, useEffect, useState} from 'react';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon,
    IonList, IonLoading,
    IonPage,
    IonTitle, IonToast,
    IonToolbar
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { getLogger } from '../core';
import Movie from "./Movie";
import {MovieContext} from "./MovieProvider";
import {RouteComponentProps} from "react-router";
import {Network} from "@capacitor/network";
import {AuthContext} from "../auth";

const log = getLogger('MovieList');

const MovieList: React.FC<RouteComponentProps> = ({history}) => {
    const { movies, fetching, fetchingError } = useContext(MovieContext);
    const { logout } = useContext(AuthContext);
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

    log('render');
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
            <IonHeader>
                <IonToolbar color="primary" className="header-toolbar">
                    <IonTitle className="ion-text-left" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        My Movie List
                        <div
                            style={{
                                display: 'inline-block',
                                marginLeft: '10px',
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                backgroundColor: isOnline ? 'limegreen' : 'red',
                                boxShadow: `0 0 4px ${isOnline ? 'limegreen' : 'red'}`,
                                verticalAlign: 'middle',
                            }}
                        ></div>
                    </IonTitle>
                    <IonButtons slot="end">
                        <IonButton
                            color="light"
                            fill="outline"
                            onClick={() => {
                                logout?.();
                                history.replace('/login');
                            }}
                            style={{ marginRight: '10px' }}
                        >
                            Logout
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonLoading isOpen={fetching} message="Fetching movies"/>
                {movies && (
                    <IonList>
                        {movies.map(({ _id, name, description, date, seen, rating }) =>
                            <Movie key={_id} _id={_id} name={name} description={description} date={date} seen={seen} rating={rating} onEdit={id => history.push(`/movie/${id}`)}/>)}
                    </IonList>
                )}
                {fetchingError && (
                    <div>{fetchingError.message || 'Failed to fetch movies'}</div>
                )}
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton color={"primary"} onClick={() => history.push('/movie')}>
                        <IonIcon icon={add}/>
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default MovieList;
