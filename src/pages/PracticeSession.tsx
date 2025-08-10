import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  Chip,
  Rating
} from '@mui/material'
import { dummyMCQs, dummyFlashcards } from '@/data/dummyData'

export default function PracticeSessionPage() {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)
  const [flipped, setFlipped] = useState(false)
  const [confidence, setConfidence] = useState(3)
  
  // Combine MCQs and Flashcards for demo
  const allItems = [
    ...dummyMCQs.map(mcq => ({ type: 'mcq', content: mcq })),
    ...dummyFlashcards.map(fc => ({ type: 'flashcard', content: fc }))
  ]
  
  const currentItem = allItems[currentIndex]
  const progress = ((currentIndex + 1) / allItems.length) * 100

  const handleSubmitMCQ = () => {
    setShowResult(true)
    setTimeout(() => {
      handleNext()
    }, 2000)
  }

  const handleNext = () => {
    if (currentIndex < allItems.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswers([])
      setShowResult(false)
      setFlipped(false)
      setConfidence(3)
    } else {
      navigate('/practice')
    }
  }

  const renderMCQ = () => {
    const mcq = currentItem.content as typeof dummyMCQs[0]
    
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {mcq.question}
          </Typography>
          
          <RadioGroup>
            {mcq.options.map((option) => (
              <FormControlLabel
                key={option.id}
                value={option.id}
                control={
                  <Radio
                    checked={selectedAnswers.includes(option.id)}
                    onChange={() => setSelectedAnswers([option.id])}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>{option.text}</Typography>
                    {showResult && (
                      <Chip
                        size="small"
                        label={option.isCorrect ? 'Correct' : 'Wrong'}
                        color={option.isCorrect ? 'success' : 'error'}
                      />
                    )}
                  </Box>
                }
              />
            ))}
          </RadioGroup>
          
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleSubmitMCQ}
              disabled={selectedAnswers.length === 0 || showResult}
            >
              Submit Answer
            </Button>
            {showResult && (
              <Button onClick={handleNext}>
                Next
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    )
  }

  const renderFlashcard = () => {
    const flashcard = currentItem.content as typeof dummyFlashcards[0]
    
    return (
      <Box>
        <Card
          sx={{
            minHeight: 300,
            cursor: 'pointer',
            position: 'relative',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
          onClick={() => setFlipped(!flipped)}
        >
          <CardContent
            sx={{
              minHeight: 300,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backfaceVisibility: 'hidden',
              position: 'absolute',
              width: '100%',
              height: '100%'
            }}
          >
            <Typography variant="h5" align="center">
              {flashcard.question}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
              Click to flip
            </Typography>
          </CardContent>
          
          <CardContent
            sx={{
              minHeight: 300,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              position: 'absolute',
              width: '100%',
              height: '100%'
            }}
          >
            <Typography variant="h5" align="center">
              {flashcard.answer}
            </Typography>
          </CardContent>
        </Card>
        
        {flipped && (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="contained" color="success" onClick={handleNext}>
              Easy
            </Button>
            <Button variant="contained" color="warning" onClick={handleNext}>
              Medium
            </Button>
            <Button variant="contained" color="error" onClick={handleNext}>
              Hard
            </Button>
          </Box>
        )}
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Question {currentIndex + 1} of {allItems.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {Math.round(progress)}% Complete
          </Typography>
        </Box>
        <LinearProgress variant="determinate" value={progress} />
      </Box>

      {currentItem?.type === 'mcq' && renderMCQ()}
      {currentItem?.type === 'flashcard' && renderFlashcard()}

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>
            How confident are you?
          </Typography>
          <Rating
            value={confidence}
            onChange={(e, value) => setConfidence(value || 3)}
            size="large"
          />
        </CardContent>
      </Card>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={() => navigate('/practice')}>
          Exit Practice
        </Button>
        <Button 
          variant="outlined" 
          onClick={handleNext}
          disabled={currentItem?.type === 'mcq' && !showResult}
        >
          Skip
        </Button>
      </Box>
    </Box>
  )
}