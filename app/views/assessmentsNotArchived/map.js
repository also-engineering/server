function(doc)
{ 
	if (doc.collection==="assessment" && (doc.archived === "false" || doc.archived === false))
	{
		emit(doc.id, null);
	}
}