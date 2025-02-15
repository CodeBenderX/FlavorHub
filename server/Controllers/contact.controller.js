import Contact from '../Models/contact.model.js';

const create = async (req, res) => { 
    const contact = new Contact(req.body)
    try {
        await contact.save()
        return res.status(200).json({
            message: "Successfully saved the contact!"
        })
    } catch (err) {
        return res.status(400).json({
            error: err.message || "An error occurred while saving the contact."
        })
    }
}
const list = async (req, res) => {
    try {
        let contact = await Contact.find().select('name email updated created')
        res.json(contact)
    } catch (err) {
        return res.status(400).json({
            error: err.message || "An error occurred while retrieving contacts."
        })
    }
}
export default { create, list }