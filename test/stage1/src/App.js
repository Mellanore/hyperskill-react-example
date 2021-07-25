import React from 'react';
import './index.css';

const monthData = [
    { name: 'January', dayCount: 31 },
    { name: 'February', dayCount: 28 },
    { name: 'March', dayCount: 31 },
    { name: 'April', dayCount: 30 },
    { name: 'May', dayCount: 31 },
    { name: 'June', dayCount: 30 },
    { name: 'July', dayCount: 31 },
    { name: 'August', dayCount: 31 },
    { name: 'September', dayCount: 30 },
    { name: 'October', dayCount: 31 },
    { name: 'November', dayCount: 30 },
    { name: 'December', dayCount: 31 }
];

const MonthCard = () => {
    return <div className="monthCard">
        <span className="monthCard-number">1.</span>
        <span className="monthCard-name">January</span>
        <div className="monthCard-days">
            {
                [...Array(31)].map((elem, index) => {
                    return <div className="monthCard-day">{index + 1}</div>
                })
            }
        </div>
    </div>;
};

function App() {
    return (
        <div className="App">
            <div className="calendar">
                {
                    monthData.map((month, index) => {
                        return <MonthCard />;
                    })
                }
            </div>
        </div>
    );
}

export default App;
