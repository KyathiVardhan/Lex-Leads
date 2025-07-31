import express from 'express';
import SalesAuthMiddleware from '../middleware/sales-auth-middleware';
import addLeadsToSales from '../controllers/add-lead';
import getLeads from '../controllers/get-leads';
import updateLead from '../controllers/update-lead';

const router = express.Router();

router.post('/add-leads-to-sales', SalesAuthMiddleware, addLeadsToSales);
router.get('/leads', SalesAuthMiddleware, getLeads);
router.put('/leads/:leadId', SalesAuthMiddleware, updateLead);

export default router;