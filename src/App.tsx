import './App.css';

import { ChangePasswordForm } from '@/components/forms/ResetpassowrdForm';
import { EmailResetForm } from '@/components/forms/ForgotPasswordForm'

function App() {
    return (
        <div style={{ padding: "40px", maxWidth: "500px", margin: "auto" }}>

            {/* Forgot Password Form */}
            <div style={{ marginBottom: "40px" }}>
                <h2>Forgot Password</h2>
                <EmailResetForm />
            </div>

            {/* Change Password Form */}
            <div>
                <h2>Change Password</h2>
                <ChangePasswordForm />
            </div>
        </div>
    );
}

export default App;
