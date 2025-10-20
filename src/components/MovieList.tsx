import React, {useContext} from 'react';
import {
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon,
    IonList, IonLoading,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import { add } from 'ionicons/icons';
import { getLogger } from '../core';
import Movie from "./Movie";
import {MovieContext} from "./MovieProvider";
import {RouteComponentProps} from "react-router";

const log = getLogger('MovieList');

const MovieList: React.FC<RouteComponentProps> = ({history}) => {
    const { movies, fetching, fetchingError } = useContext(MovieContext);
    log('render');
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary" className={'header-toolbar'}>
                    <IonTitle>My Movie List</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonLoading isOpen={fetching} message="Fetching movies"/>
                {movies && (
                    <IonList>
                        {movies.map(({ id, name, description, date, seen }) =>
                            <Movie key={id} id={id} name={name} description={description} date={date} seen={seen} onEdit={id => history.push(`/movie/${id}`)}/>)}
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
