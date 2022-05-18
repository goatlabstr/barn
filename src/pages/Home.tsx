import * as React from 'react';
import ProductCTA from '../modules/views/ProductCTA';
import AppAppBar from '../modules/views/AppAppBar';

function Index() {
    return (
        <React.Fragment>
            <AppAppBar/>
            <ProductCTA/>
        </React.Fragment>
    );
}

export default Index;
