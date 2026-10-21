import { Route } from 'react-router-dom';

import Meals from '../../pages/mess-partner/Meals';

export default function MessToutes() {
    return (
        <Route
            path="/mess-partner/meals"
            element={<Meals />}
        />
    );
}