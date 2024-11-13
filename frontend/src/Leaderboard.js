import React, { useState, useMemo } from 'react';

const Leaderboard = () => {
    const data = useMemo(() => ([
        { id: 1, name: 'GPT-4o', votes: "-", rating: "-" },
        { id: 2, name: 'Claude-3.5-sonnet', votes: "-", rating: "-" },
        { id: 3, name: 'Gemini-1.5-pro', votes: "-", rating: "-" },
        { id: 4, name: 'Llama-70b', votes: "-", rating: "-" },
        { id: 5, name: 'Qwen2.5-Coder-32B', votes: "-", rating: "-" },
    ]), []);
    const [sortConfig, setSortConfig] = useState(null);

    const sortedData = [...data];

    if (sortConfig !== null) {
        sortedData.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const styles = {
        leaderboardContainer: {
            marginTop: '20px',
            textAlign: 'center',
        },
        catchyText: {
            fontSize: '18px',
            fontStyle: 'italic',
            color: '#555',
            marginBottom: '20px',
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            margin: '25px 0',
            fontSize: '18px',
            textAlign: 'left',
        },
        th: {
            cursor: 'pointer',
            backgroundColor: '#f4f4f4',
            padding: '12px',
            border: '1px solid #ddd',
        },
        td: {
            padding: '12px',
            border: '1px solid #ddd',
        },
        thHover: {
            backgroundColor: '#ddd',
        },
        evenRow: {
            backgroundColor: '#f3f3f3',
        },
        oddRow: {
            backgroundColor: '#fafafa',
        },
    };

    return (
        <div style={styles.leaderboardContainer}>
            <h2>LLM Leaderboard</h2>
            <p style={styles.catchyText}>
                We are currently in the process of evaluating these models! Stay tuned to see which model is the best for answering all your programming questions!
            </p>

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th} onClick={() => handleSort('name')}>
                            LLM{sortConfig?.key === 'name' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
                        </th>
                        <th style={styles.th} onClick={() => handleSort('votes')}>
                            Votes {sortConfig?.key === 'votes' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
                        </th>
                        <th style={styles.th} onClick={() => handleSort('rating')}>
                            Rating {sortConfig?.key === 'rating' ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : null}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((model, index) => (
                        <tr key={model.id} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                            <td style={styles.td}>{model.name}</td>
                            <td style={styles.td}>{model.votes}</td>
                            <td style={styles.td}>{model.rating}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;