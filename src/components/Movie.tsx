import React, { memo } from 'react';
import { getLogger } from '../core';
import {MovieProps} from "./MovieProps";
import '../theme/variables.css'
import {IonBadge, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonLabel, IonText} from "@ionic/react";

const log = getLogger('Movie');

interface MoviePropsExt extends MovieProps {
    onEdit: (id?: string) => void;
}

const Movie: React.FC<MoviePropsExt> = ({ id, name, description, date, seen, onEdit }) => {
    log(`render ${id}. ${name} - ${date}`);
    return (
        <IonCard onClick={() => onEdit(id?.toString())}>
            <IonCardHeader>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <IonCardTitle className={"card-title"}>{name}</IonCardTitle>
                    <IonBadge color={seen ? 'success' : 'danger'}>
                        {seen ? 'Seen' : 'Not seen'}
                    </IonBadge>
                </div>
            </IonCardHeader>

            <IonCardContent>
                <IonText>
                    <p>{description}</p>
                </IonText>

                <IonItem lines="none" style={{ marginTop: '10px' }}>
                    <IonLabel className={"ion-text-end"} style={{"font-size": "0.8em"}}>
                        <strong>Date Premiered: {new Date(date).toLocaleDateString()}</strong>
                    </IonLabel>
                </IonItem>
            </IonCardContent>
        </IonCard>

    );
};

export default memo(Movie);
