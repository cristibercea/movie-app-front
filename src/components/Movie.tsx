import React, { memo } from 'react';
import { getLogger } from '../core';
import {MovieProps} from "./MovieProps";
import '../theme/variables.css'
import {IonBadge, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonLabel} from "@ionic/react";
import {RouteComponentProps} from "react-router";
import MovieDescription from "./MovieDescription";

const log = getLogger('Movie');

interface MoviePropsExt extends MovieProps {
    onEdit: (_id?: string) => void;
}

export type MovieEditProps = RouteComponentProps<{
    id?: string;
}>

const Movie: React.FC<MoviePropsExt> = ({ _id, name, description, date, seen, rating, onEdit }) => {
    log(`render ${_id}. ${name} - ${date}`);
    return (
        <IonCard onClick={() => onEdit(_id)}>
            <IonCardHeader>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <IonCardTitle className="card-title">{name}</IonCardTitle>
                    <IonBadge color={seen ? 'success' : 'danger'}>
                        {seen ? 'Seen' : 'Not seen'}
                    </IonBadge>
                </div>
            </IonCardHeader>

            <IonCardContent>
                <MovieDescription description={description} />

                <IonItem lines="none">
                    <IonLabel className="ion-text-end" style={{ fontSize: '0.9em' }}>
                        <strong>Date Premiered: {new Date(date).toLocaleDateString()}</strong>
                    </IonLabel>
                </IonItem>

                {rating && (
                    <IonItem lines="none">
                        <IonLabel className="ion-text-end" style={{ fontSize: '0.8em' }}>
                            <strong>
                                Your Rating: {Number(rating).toFixed(1)}/10 <span style={{ color: '#FFD700' }}>★</span>
                            </strong>
                        </IonLabel>
                    </IonItem>
                )}
            </IonCardContent>
        </IonCard>
    );
};

export default memo(Movie);
