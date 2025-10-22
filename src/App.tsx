import { Redirect, Route } from 'react-router-dom';
import {IonApp, IonLoading, IonRouterOutlet, setupIonicReact} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import React, {useContext} from "react";
import MovieAdd from "./components/MovieAdd";
import MovieEdit from "./components/MovieEdit";
import MovieProvider from "./components/MovieProvider";
import MovieList from "./components/MovieList";
import {AuthContext, AuthProvider, Login, PrivateRoute} from "./auth";

setupIonicReact();

const App: React.FC = () => (
    <IonApp>
        <IonReactRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </IonReactRouter>
    </IonApp>
);

const AppRoutes: React.FC = () => {
    const { isAuthenticated, isCheckingAuth } = useContext(AuthContext);

    return (
        <>
            <IonLoading isOpen={isCheckingAuth} message="Checking session..." />
            {!isCheckingAuth && (
                <>
                    {isAuthenticated ? (
                        <IonRouterOutlet>
                            <MovieProvider>
                                <PrivateRoute path="/movies" component={MovieList} exact />
                                <PrivateRoute path="/movie" component={MovieAdd} exact />
                                <PrivateRoute path="/movie/:id" component={MovieEdit} exact />
                            </MovieProvider>
                            <Route exact path="/" render={() => <Redirect to="/movies" />} />
                        </IonRouterOutlet>
                    ) : (
                        <IonRouterOutlet>
                            <Route path="/login" component={Login} exact />
                            <Redirect to="/login" />
                        </IonRouterOutlet>
                    )}
                </>
            )}
        </>
    );
};

export default App;
