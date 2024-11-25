import { getFirestore, doc, getDoc } from 'firebase/firestore';


export const getPaypalSecretsFromDB = async (userId) => {

    const db = getFirestore();
    const charityRef = doc(db, 'charityDetails', user.uid);
    const charityDoc = await getDoc(charityRef);

    return charityDoc.data();
}