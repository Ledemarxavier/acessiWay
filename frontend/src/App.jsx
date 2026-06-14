import { Toaster } from "@/components/ui/toaster";

import {
    QueryClientProvider
} from '@tanstack/react-query';

import {
    queryClientInstance
} from '@/lib/query-client';

import {
    pagesConfig
} from './pages.config';

import {
    BrowserRouter as Router,
    Route,
    Routes,
    useLocation
} from 'react-router-dom';

import {
    useEffect
} from "react";

import PageNotFound from './lib/PageNotFound';

import {
    AuthProvider,
    useAuth
} from '@/lib/AuthContext';

import UserNotRegisteredError
    from '@/components/UserNotRegisteredError';

import {
    AccessibilityProvider
} from '@/components/landing/AccessibilityContext';

const {
    Pages,
    Layout,
    mainPage
} = pagesConfig;

const mainPageKey =
    mainPage ??
    Object.keys(Pages)[0];

const MainPage =
    mainPageKey
        ? Pages[mainPageKey]
        : <></>;

/* =========================
   SCROLL TO TOP
========================= */
function ScrollToTop() {

    const { pathname } = useLocation();

    useEffect(() => {

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant"
        });

    }, [pathname]);

    return null;
}

const LayoutWrapper = ({
    children,
    currentPageName
}) => Layout
        ? (
            <Layout currentPageName={currentPageName}>
                {children}
            </Layout>
        )
        : <>{children}</>;

const AuthenticatedApp = () => {

    const {
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        navigateToLogin
    } = useAuth();

    // Loading
    if (
        isLoadingPublicSettings ||
        isLoadingAuth
    ) {

        return (

            <div className="fixed inset-0 flex items-center justify-center">

                <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>

            </div>
        );
    }

    // Auth errors
    if (authError) {

        if (
            authError.type ===
            'user_not_registered'
        ) {

            return (
                <UserNotRegisteredError />
            );
        }

        if (
            authError.type ===
            'auth_required'
        ) {

            navigateToLogin();

            return null;
        }
    }

    // App
    return (

        <>
            <ScrollToTop />

            <Routes>

                <Route
                    path="/"
                    element={
                        <LayoutWrapper
                            currentPageName={mainPageKey}
                        >

                            <MainPage />

                        </LayoutWrapper>
                    }
                />

                {Object.entries(Pages).map(
                    ([path, Page]) => (

                        <Route
                            key={path}
                            path={`/${path}`}
                            element={

                                <LayoutWrapper
                                    currentPageName={path}
                                >

                                    <Page />

                                </LayoutWrapper>
                            }
                        />
                    )
                )}

                <Route
                    path="*"
                    element={<PageNotFound />}
                />

            </Routes>
        </>
    );
};

function App() {

    return (

        <AuthProvider>

            <AccessibilityProvider>

                <QueryClientProvider
                    client={queryClientInstance}
                >

                    <Router>

                        <AuthenticatedApp />

                    </Router>

                    <Toaster />

                </QueryClientProvider>

            </AccessibilityProvider>

        </AuthProvider>
    );
}

export default App;