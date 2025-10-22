import React, { useState } from 'react';
import { IonText, IonButton } from '@ionic/react';

interface MovieDescriptionProps {
    description: string;
}

const MovieDescription: React.FC<MovieDescriptionProps> = ({ description }) => {
    const [expanded, setExpanded] = useState(false);

    // Câte caractere să arăți în varianta scurtă (sau folosește CSS pentru limită vizuală)
    const previewLimit = 180;

    const isLong = description.length > previewLimit;
    const shortText = description.slice(0, previewLimit);

    return (
        <div style={{ marginTop: '5px' }}>
            <IonText
                style={{
                    display: '-webkit-box',
                    WebkitLineClamp: expanded ? 'unset' : 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
            >
                <p style={{ marginBottom: '0.5em' }}>
                    {expanded ? description : shortText + (isLong ? '...' : '')}
                </p>
            </IonText>

            {isLong && (
                <IonButton
                    fill="clear"
                    size="small"
                    color="primary"
                    onClick={(e) => {
                        e.stopPropagation();
                        setExpanded(!expanded);
                    }}
                    style={{ paddingLeft: 0, textTransform: 'none' }}
                >
                    {expanded ? 'See less ▲' : 'See more ▼'}
                </IonButton>
            )}
        </div>
    );
};

export default MovieDescription;
