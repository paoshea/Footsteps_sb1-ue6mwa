import { Request, Response } from 'express';
import Company from '../models/Company';
import User from '../models/User';
import { validateCompany } from '../validators/company.validator';
import { handleError } from '../utils/errorHandler';

export const createCompany = async (req: Request, res: Response) => {
  try {
    const { error } = validateCompany(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const company = new Company(req.body);
    await company.save();

    res.status(201).json(company);
  } catch (error) {
    handleError(res, error);
  }
};

export const getCompany = async (req: Request, res: Response) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json(company);
  } catch (error) {
    handleError(res, error);
  }
};

export const updateCompany = async (req: Request, res: Response) => {
  try {
    const { error } = validateCompany(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json(company);
  } catch (error) {
    handleError(res, error);
  }
};

export const updateCompanySettings = async (req: Request, res: Response) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { $set: { settings: req.body } },
      { new: true, runValidators: true }
    );

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json(company);
  } catch (error) {
    handleError(res, error);
  }
};

export const uploadCompanyLogo = async (req: Request, res: Response) => {
  try {
    if (!req.uploadedFile) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { $set: { logo: req.uploadedFile.url } },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json({ logo: company.logo });
  } catch (error) {
    handleError(res, error);
  }
};

export const getCompanyMetrics = async (req: Request, res: Response) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const totalMembers = await User.countDocuments({ companyId: company._id });
    const activeMembers = await User.countDocuments({
      companyId: company._id,
      isActive: true,
    });

    const metrics = {
      totalMembers,
      activeMembers,
      membershipRate: (activeMembers / totalMembers) * 100,
      // Add more metrics as needed
    };

    res.json(metrics);
  } catch (error) {
    handleError(res, error);
  }
};

export const getCompanyMembers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, role, department } = req.query;
    const query: any = { companyId: req.params.id };

    if (role) query.role = role;
    if (department) query.department = department;

    const members = await User.find(query)
      .select('-password')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      members,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const inviteMembers = async (req: Request, res: Response) => {
  try {
    const { emails, role, department } = req.body;

    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ message: 'No email addresses provided' });
    }

    // In a real application, you would:
    // 1. Validate email addresses
    // 2. Check if users already exist
    // 3. Send invitation emails
    // 4. Create temporary invitation records

    res.json({
      message: `Invitations sent to ${emails.length} email addresses`,
      invitedEmails: emails,
    });
  } catch (error) {
    handleError(res, error);
  }
};