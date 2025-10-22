import React, { useCallback, useContext, useState } from 'react';
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
import {MovieEditProps} from "./Movie";

const log = getLogger('MovieAdd');

const MovieAdd: React.FC<MovieEditProps> = ({history}) => {
    const { saving, savingError, saveMovie } = useContext(MovieContext);
    const [name, setName] = useState('');
    const [description, setDesc] = useState('');
    const [date, setDate] = useState(new Date());
    const [seen, setSeen] = useState(false);
    const [rating, setRating] = useState(0);

    const clearSelection = useCallback(()=>{
        setName('');
        setDesc('');
        setDate(new Date());
        setSeen(false);
        setRating(0);
        history.goBack()
    }, [history])
    
    const handleSave = useCallback(() => {
        if (name != '' && description != '' && date != null && seen != null && rating != null) {
            if (saveMovie) saveMovie({
                name: name,
                description: description,
                date: date.toISOString(),
                seen: seen,
                rating: rating
            }).then(clearSelection);
        }
    }, [name, description, date, seen, rating, saveMovie, clearSelection]);

    const handleCancel = useCallback(clearSelection, [clearSelection])
    
    log('render');
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary" className="ion-text-center">
                    <IonTitle>Add a Movie</IonTitle>
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

                    <IonInput
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        label="Rate the movie (0–10)"
                        labelPlacement="stacked"
                        value={rating?.toString() || '0'}
                        onIonChange={(e) => {
                            const value = parseFloat(e.detail.value || '0');
                            if (!isNaN(value)) setRating(value);
                        }}
                        placeholder="e.g. 8.5"
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
                        <IonButton onClick={handleCancel} fill="solid" color="danger">
                            Cancel
                        </IonButton>
                        &nbsp;&nbsp;
                        <IonButton onClick={handleSave} fill="solid" color="success">
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

export default MovieAdd;
