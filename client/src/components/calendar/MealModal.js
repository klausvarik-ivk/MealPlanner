import React, { useState } from 'react'
import Modal from 'react-modal'
import { Select, FormControl, Button, TextField, MenuItem, Typography } from '@material-ui/core'
import { Close, ChevronLeft, Publish } from '@material-ui/icons'
import { addMeal } from '../../actions/actions'
import IngredientList from '../general/IngredientList'
import './MealModal.css'

export default function MealModal (props) {
  const [mealName, setMealName] = useState('')
  const [mealNum, setMealNum] = useState('')
  const [ingredients, setIngredients] = useState([{
    name: '',
    units: 'cup',
    qty: 0
  }])
  const [description, setDescription] = useState('')

  Modal.setAppElement('#root')
  return (
    <Modal
      id='mealModal'
      isOpen={props.isOpen}
      onRequestClose={props.exit}
      onAfterClose={() => handleClose(setMealName, setMealNum, setIngredients, setDescription)}
      contentLabel='Meal Modal'
    >
      <div className='modalHeader'>
        <Typography variant='h4'>Add a meal for {props.date.toDateString()}</Typography>
        <Button variant='contained' startIcon={<ChevronLeft />} onClick={() => handleReturn(props)}>Return</Button>
      </div>
      <form id='mealModalForm' onSubmit={(event) => handleSubmit(event, props, mealName, mealNum, ingredients, description)}>
        <FormControl className='input-field'>
          <TextField label='Meal Name' onChange={(event) => setMealName(event.target.value)} required />
        </FormControl>
        <FormControl className='input-field'>
          <Select labelId='selectLabel' defaultValue='0' name='mealNum' id='mealSelect' onChange={(event) => setMealNum(event.target.value)} required>
            <MenuItem value='0'>Breakfast</MenuItem>
            <MenuItem value='1'>Lunch</MenuItem>
            <MenuItem value='2'>Dinner</MenuItem>
            <MenuItem value='3'>Snack</MenuItem>
          </Select>
        </FormControl>
        <FormControl className='input-field list-holder'>
          <Typography variant='h5'>Ingredients:</Typography>
          <IngredientList
            ingredients={ingredients}
            uid={props.uid}
            handleQtyChange={(event) => handleIngredientQtyChange(event, ingredients, setIngredients)}
            handleUnitsChange={(event) => handleIngredientUnitsChange(event, ingredients, setIngredients)}
            handleNameChange={(event) => handleIngredientNameChange(event, ingredients, setIngredients)}
            removeIngredient={(index) => removeIngredient(index, ingredients, setIngredients)}
          />
          <Button variant='contained' onClick={(event) => handleAddIngredient(event, ingredients, setIngredients)}>Add Ingredient</Button>
        </FormControl>
        <FormControl className='input-field'>
          <TextField label='Description' onChange={(event) => setDescription(event.target.value)} />
        </FormControl>
        <div className='modalFooterButtons'>
          <Button startIcon={<Publish />} type='submit' variant='contained'>Submit</Button>
          <Button startIcon={<Close />} variant='contained' onClick={props.exit}>Cancel</Button>
        </div>
      </form>
    </Modal>
  )
}

const handleReturn = (props) => {
  props.showListModal()
  props.exit()
}

const handleClose = (setMealName, setMealNum, setIngredients, setDescription) => {
  setMealName('')
  setMealNum('')
  setIngredients([{ name: '', units: 'cup', qty: 0 }])
  setDescription('')
}

const handleIngredientQtyChange = (event, ingredients, setIngredients) => {
  if (!event.target.value.match(/\d+/) || parseInt(event.target.value) < 0) {
    event.preventDefault()
    return
  }
  const index = event.target.parentElement.parentElement.parentElement.getAttribute('index')
  const newIngredients = [...ingredients]
  newIngredients[index].qty = event.target.value
  setIngredients(newIngredients)
}

const handleIngredientUnitsChange = (event, ingredients, setIngredients) => {
  const index = event.target.parentElement.parentElement.parentElement.getAttribute('index')
  const newIngredients = [...ingredients]
  newIngredients[index].units = event.target.value
  setIngredients(newIngredients)
}

const handleIngredientNameChange = (event, ingredients, setIngredients) => {
  const index = event.target.parentElement.parentElement.parentElement.parentElement.getAttribute('index')
  const newIngredients = [...ingredients]
  newIngredients[index].name = event.target.value
  setIngredients(newIngredients)
}

const handleAddIngredient = (event, ingredients, setIngredients) => {
  event.preventDefault()
  const newIngredients = [...ingredients, { name: '', units: 'cup', qty: 0 }]
  setIngredients(newIngredients)
}

const handleSubmit = (event, props, mealName, mealNum, ingredients, description) => {
  event.preventDefault()
  const validMealNum = mealNum || 0
  // convert mealNum to number and call api
  const payload = {
    name: mealName,
    ingredients: ingredients.filter(ingredient => ingredient.name && ingredient.qty),
    date: props.date.toString(),
    mealNum: parseInt(validMealNum),
    description: description
  }
  addMeal(payload, props.uid).then(() => handleReturn(props)).catch(error => console.log(error))
}

const removeIngredient = (index, ingredients, setIngredients) => {
  const newIngredients = [...ingredients]
  newIngredients.splice(index, 1)
  setIngredients(newIngredients)
}
