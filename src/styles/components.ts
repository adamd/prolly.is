import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
`

export const QuestionCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  text-align: center;
`

export const Question = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
  font-weight: 600;
`

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`

export const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
  max-width: 400px;

  &:hover {
    background-color: #0056b3;
  }
`

export const CompletionMessage = styled.div`
  font-size: 2.5rem;
  color: #28a745;
  margin: 2rem 0;
  font-weight: bold;
`

export const CompletionButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`

export const CompletionButton = styled.button`
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
  max-width: 300px;

  &:hover {
    background-color: #5a6268;
  }
`

export const ConfettiContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
`

export const ReloadButton = styled(Button)`
  background-color: #6c757d;
  margin-top: 1rem;
  font-size: 1.2rem;
  padding: 0.75rem 1.5rem;
  max-width: 200px;

  &:hover {
    background-color: #5a6268;
  }
` 