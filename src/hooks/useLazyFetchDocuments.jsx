import { useState, useEffect } from "react";
import {db} from "../firebase/config"
import {collection, query, orderBy, onSnapshot, limit} from "firebase/firestore"

export const useLazyFetchDocuments = (docCollection) => {

	const [documents, setDocuments] = useState(null)
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(null)

	// Cleanup
	// deal with memory leak
	const [cancelledLazy, setCancelledLazy] = useState(false)
	const [limitRef, setLimitRef] = useState(5)

	useEffect(() => {

		const loadLazyData = async() => {
			
			console.log('NEW LIMIT: ', limitRef)
			if (cancelledLazy) return;
			console.log('NEW LIMIT: ', limitRef)

			setLoading(true)

			const collectionRef = await collection(db, docCollection)

			try {
				let q

				q = await query(collectionRef, orderBy("createdAt", "desc"), limit(limitRef))				
				
				await onSnapshot(q, (querySnapshot) => {
					setDocuments(
						querySnapshot.docs.map((doc) => ({
							id: doc.id,
							...doc.data()
						}))
					)
				})
				setLoading(false)
			
			} catch (error) {
				setError(error.message)
				setLoading(false)
			}
		}
		loadLazyData()

		return () => setCancelledLazy(true)

	}, [docCollection, limitRef, cancelledLazy])

	return {documents, loading, error, limitRef, setLimitRef}
}