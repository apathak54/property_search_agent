import { useState } from 'react';
import { Radio, FormControlLabel, FormLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const [paymentType, setPaymentType] = useState<'one-time' | 'monthly' | null>(null);
    const navigate = useNavigate();

    const handlePropertyClick = (propertyType: 'normal' | 'premium' | 'luxury') => {
        navigate('/property', {
            state: {
                type: paymentType,
                propertyType,
            },
        });
    };

    const propertyCards = [
        { type: 'normal', label: 'Normal Property', bgColor: 'bg-green-300' },
        { type: 'premium', label: 'Premium Property', bgColor: 'bg-blue-300' },
        { type: 'luxury', label: 'Luxury Property', bgColor: 'bg-yellow-300' },
    ];

    return (
        <div className="min-h-[90vh] bg-gray-50 mt-15 p-4">

            <div className="px-8 py-6">
                <FormLabel component="legend" className="text-xl  font-medium text-center mb-6 block">
                    Choose Investment Type
                </FormLabel>
                <div className="flex justify-between items-center max-w-3xl mx-auto">
                    <FormControlLabel className=''
                        value="one-time"
                        control={
                            <Radio
                                checked={paymentType === 'one-time'}
                                onChange={() => setPaymentType('one-time')}
                            />
                        }
                        label="One-time"
                    />

                    <FormControlLabel
                        value="monthly"
                        control={
                            <Radio
                                checked={paymentType === 'monthly'}
                                onChange={() => setPaymentType('monthly')}
                            />
                        }
                        label="Monthly"
                    />
                </div>
            </div>


            <div className="flex justify-center items-center  p-4 gap-6">
                {propertyCards.map(({ type, label, bgColor }) => (
                    <div
                        key={type}
                        onClick={() => handlePropertyClick(type as 'normal' | 'premium' | 'luxury')}
                        className={`cursor-pointer ${bgColor} rounded-lg p-8 h-60 flex justfiy-center items-center shadow-lg hover:scale-105 transition-transform relative`}
                    >
                        <h2 className="text-xl font-bold text-center z-10 relative">{label}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LandingPage;
