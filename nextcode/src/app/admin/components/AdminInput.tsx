import { INPUT_BG_COLOR, RED_COLOR, FOCUS_COLOR } from "../constants/colors";

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const AdminInput: React.FC<AdminInputProps> = ({ label, ...props }) => (
    <div style={{ width: '100%' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#4B5563', marginBottom: '0.3rem' }}>{label}</label>
        <input 
            style={{ 
                width: '100%', 
                padding: '0.75rem', 
                borderRadius: '0.5rem', 
                border: '1px solid #D1D5DB', 
                backgroundColor: INPUT_BG_COLOR, 
                transition: 'border-color 0.2s, box-shadow 0.2s',
                outline: 'none',
            }}
            // Focus simulation (not truly reactive like Tailwind, but sets a base style)
            onFocus={(e) => {
                e.currentTarget.style.borderColor = RED_COLOR;
                e.currentTarget.style.boxShadow = `0 0 0 2px ${FOCUS_COLOR}`;
            }}
            onBlur={(e) => {
                e.currentTarget.style.borderColor = '#D1D5DB';
                e.currentTarget.style.boxShadow = 'none';
            }}
            {...props}
        />
    </div>
);

export default AdminInput