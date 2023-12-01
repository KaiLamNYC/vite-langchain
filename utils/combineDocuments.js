//MAPPING OVER ARRAY OF DOCUMENTS AND JOINING TO STRING
function combineDocuments(docs) {
	return docs.map((doc) => doc.pageContent).join("\n\n");
}

export { combineDocuments };
