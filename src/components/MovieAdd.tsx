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
import { RouteComponentProps } from 'react-router';

const log = getLogger('MovieAdd');

type MovieEditProps = RouteComponentProps<{
    id?: string;
}>

const MovieAdd: React.FC<MovieEditProps> = ({history}) => {
    const { saving, savingError, saveMovie } = useContext(MovieContext);
    const [name, setName] = useState('');
    const [description, setDesc] = useState('');
    const [date, setDate] = useState(new Date());
    const [seen, setSeen] = useState(false);

    const clearSelection = useCallback(()=>{
        setName('');
        setDesc('');
        setDate(new Date());
        setSeen(false);
        history.goBack()
    }, [history])
    
    const handleSave = useCallback(() => {
        if (name != '' && description != '' && date != null) {
            if (saveMovie) saveMovie({
                name: name,
                description: description,
                date: date.toISOString(),
                seen: seen,
            }).then(clearSelection);
        }
    }, [name, description, date, seen, saveMovie, clearSelection]);

    const handleCancel = useCallback(clearSelection, [clearSelection])
    
    log('render');
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary" className={'ion-text-center'}>
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

export default MovieAdd;
