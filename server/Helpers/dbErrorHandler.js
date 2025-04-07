const getErrorMessage = (err) => { 
	let message = ''
	if (err.code) {
	switch (err.code) {
	case 11000:
	case 11001:
	message = getUniqueErrorMessage(err) 
	break
	default:
	message = 'Something went wrong' 
	}
	} else {
	for (let errName in err.errors) {
	if (err.errors[errName].message) 
	message = err.errors[errName].message
	} 
	}
	return message 
	}
    const getUniqueErrorMessage = (err) => {
		let output;
		try {
		  const match = err.message.match(/index:\s+([a-zA-Z0-9_]+)_1/);
		  const fieldName = match && match[1] ? match[1] : null;
		  output = fieldName
			? fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists'
			: 'Unique field already exists';
		} catch (ex) {
		  output = 'Unique field already exists';
		}
		return output;
	  };
    
	export default {getErrorMessage}
