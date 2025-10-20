import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
    IonButton,
    IonButtons, IonCheckbox,
    IonContent, IonDatetime,
    IonHeader,
    IonInput, IonLabel,
    IonLoading,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import { getLogger } from '../core';
import { MovieContext } from './MovieProvider';
import { RouteComponentProps } from 'react-router';
import {MovieProps} from "./MovieProps";

const log = getLogger('MovieEdit');

type MovieEditProps = RouteComponentProps<{
    id?: string;
}>

const MovieEdit: React.FC<MovieEditProps> = ({history, match}) => {
    const { movies, saving, savingError, saveMovie } = useContext(MovieContext);
    const [name, setName] = useState('');
    const [description, setDesc] = useState('');
    const [date, setDate] = useState(new Date());
    const [seen, setSeen] = useState(false);
    const [movie, setMovie] = useState<MovieProps>();
    useEffect(() => {
        log('useEffect');
        const routeId = match.params.id || '';
        const movie = movies?.find(mv => mv.id.toString() === routeId);
        if (movie) {
            setName(movie.name);
            setDesc(movie.description);
            setDate(new Date(movie.date));
            setSeen(movie.seen);
            setMovie(movie);
        }
    }, [match.params.id, movies, setMovie, setName, setDesc, setDate, setSeen]);

    const handleSave = useCallback(() => {
        if (name != '' && description != '' && date != null) {
            if (saveMovie) saveMovie(
                { ...movie, name: name, description: description, date: date.toISOString(), seen: seen }
            ).then(history.goBack);
        }
    }, [movie, name, description, date, seen, saveMovie, history]);

    const handleCancel = useCallback(history.goBack, [history])

    log('render');
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary" className={'ion-text-center'}>
                    <IonTitle>Edit a Movie</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <div
                    style={{
                        maxWidth: '400px',
                        margin: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        marginTop: '40px',
                    }}
                >
                    <IonInput
                        label="Name"
                        labelPlacement="stacked"
                        value={name}
                        onIonChange={(e) => setName(e.detail.value || '')}
                        placeholder="Enter movie name"
                    />

                    <IonInput
                        label="Description"
                        labelPlacement="stacked"
                        value={description}
                        onIonChange={(e) => setDesc(e.detail.value || '')}
                        placeholder="Enter movie description"
                    />

                    <div>
                        <IonLabel>Release date</IonLabel>
                        <IonDatetime
                            presentation="date"
                            color="primary"
                            value={date.toISOString()}
                            onIonChange={(e) => {
                                const value = e.detail.value;
                                if (value && typeof value === 'string') {
                                    const newDate = new Date(value);
                                    if (!isNaN(newDate.getTime())) {
                                        setDate(newDate);
                                    }
                                }
                            }}
                        />
                    </div>

                    <IonCheckbox
                        justify="start"
                        labelPlacement="end"
                        checked={seen}
                        onIonChange={(e) => setSeen(e.detail.checked || false)}
                    >
                        Already Watched
                    </IonCheckbox>

                    <IonButtons className="ion-margin-top ion-justify-content-end">
                        <IonButton onClick={handleCancel} fill={"solid"} color="danger">
                            Cancel
                        </IonButton>
                        &nbsp;
                        &nbsp;
                        <IonButton onClick={handleSave} fill={"solid"} color="success">
                            Save
                        </IonButton>
                    </IonButtons>

                    {savingError && (
                        <div style={{ color: 'red', textAlign: 'center' }}>
                            {savingError.message || 'Failed to save movie'}
                        </div>
                    )}

                    <IonLoading isOpen={saving} message="Saving movie..." />
                </div>
            </IonContent>
        </IonPage>
    );
};

export default MovieEdit;
