import { useState, useEffect, useReducer } from "react";

import { db } from "../firebase/config"

import { collection, addDoc, Timestamp, setDoc, doc} from "firebase/firestore";

const initialState = {
	loading: null,
	error: null,
}

const insertReducer = (state, action) => {

	switch(action.type) {
		case "LOADING":
			return {loading: true, error: null}
		case "INSERTED_DOC":
			return {loading: false, error: null}
		case "ERROR":
			return {loading: false, error: action.payload}
		default:
			return state
	}

}

export const useInsertDocument = (docCollection) => {

	const [response, dispatch] = useReducer(insertReducer, initialState)

	// Cleanup
	// deal with memory leak
	const [cancelled, setCancelled] = useState(false)

	const checkCancelBeforeDispatch = (action) => {
		if (!cancelled){
			dispatch(action)
		}
	}

	const insertDocument = async(document, uid=null) => {

		checkCancelBeforeDispatch({
			type: "LOADING",
		})

		try {
			
			if (!uid) {
				const newDocument = {...document, createdAt: Timestamp.now()}
				const colRef = collection(db, docCollection)
				const insertedDocument = await addDoc(colRef, newDocument)

				checkCancelBeforeDispatch({
					type: "INSERTED_DOC",
					payload: insertedDocument,
				})

			} else {
				// In case uid was passed as argument, i want to insert a new doc to users collection in order to track users.

				// Define document
				const newDocument = {...document, createdAt: Timestamp.now()}

				// Add document with specified id (in this case, it will be the user uid)
				await setDoc(
					doc(db, "users", uid), newDocument
				)

				checkCancelBeforeDispatch({
					type: "INSERTED_DOC",
					payload: newDocument,
				})
			}

		} catch (error) {
			checkCancelBeforeDispatch({
				type: "ERROR",
				payload: error.message,
			})
		}
	}

	useEffect(() => {
		return () => setCancelled(true)
	}, [])

	return {insertDocument, response}
}