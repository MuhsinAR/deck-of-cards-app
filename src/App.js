import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [deckId, setDeckId] = useState(null);
  const [drawnCard, setDrawnCard] = useState(null);
  const [remaining, setRemaining] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawInterval, setDrawInterval] = useState(null);

  useEffect(() => {
    newDeck();
  }, []);

  const newDeck = async () => {
    try {
      const response = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
      setDeckId(response.data.deck_id);
      setDrawnCard(null);
      setRemaining(response.data.remaining);
    } catch (error) {
      console.error('Error creating new deck:', error);
    }
  };

  const shuffleDeck = async () => {
    if (!deckId) {
      console.error('No deck created yet!');
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
      if (response.data.success) {
        setDrawnCard(null);
        setIsLoading(false);
      } else {
        console.error('Error shuffling deck:', response.data.error);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error shuffling deck:', error);
      setIsLoading(false);
    }
  };

  const startDrawing = () => {
    setIsDrawing(true);
    setDrawInterval(setInterval(drawCard, 1000));
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    clearInterval(drawInterval);
  };

  const drawCard = async () => {
    if (!deckId) {
      console.error('No deck created yet!');
      return;
    }
    if (remaining === 0) {
      stopDrawing();
      alert('Error: no cards remaining!');
      return;
    }
    try {
      const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
      if (response.data.success) {
        setDrawnCard(response.data.cards[0]);
        setRemaining(response.data.remaining);
      } else {
        console.error('Error drawing card:', response.data.error);
      }
    } catch (error) {
      console.error('Error drawing card:', error);
    }
  };

  return (
    <div className="App">
      <h1>Deck of Cards App</h1>
      <button onClick={shuffleDeck} disabled={isLoading}>Shuffle Deck</button>
      <button onClick={isDrawing ? stopDrawing : startDrawing}>{isDrawing ? 'Stop Drawing' : 'Start Drawing'}</button>
      {isLoading && <p>Loading...</p>}
      {drawnCard && (
        <div>
          <img src={drawnCard.image} alt={drawnCard.code} />
          <p>{drawnCard.value} of {drawnCard.suit}</p>
        </div>
      )}
    </div>
  );
}

export default App;
