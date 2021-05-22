const { User } = require('./../models/userModel');
const { Skill } = require('./../models/skillModel');
const { Language } = require('./../models/languageModel');
const { JobTitle } = require('../models/jobTitlesModel');
const { ApplicantData } = require('./../models/applicantDataModel');
const { Category } = require('./../models/categoryModel');
const _ = require('lodash');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const catchAsync = require('./../utils/catchAsync').threeArg;

exports.setToken = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, {
    registraionToken: req.body.token
  });
  res.status(200).json({
    user
  });
});

exports.updateData = catchAsync(async (req, res, next) => {
  const applicantData = await ApplicantData.findByIdAndUpdate(
    { _id: req.user.additionalData },
    {
      ..._.pick(req.body, [
        'firstName',
        'lastName',
        'gender',
        'dateOfBirth',
        'phone'
      ])
    },
    { new: true, runValidators: true }
  );
  // await new Email(newUser, url).sendWelcome();
  res.status(200).json(applicantData);
});

exports.updateSkills = catchAsync(async (req, res, next) => {
  const skillId = await Skill.findOne({ name: req.body.skillName });
  if (!skillId) return next(new AppError('This is not a skill!', 400));
  let skills = await ApplicantData.findById(req.user.additionalData);
  skills = skills.skills;
  for (let i = 0; i < skills.length; i++) {
    if (skills[i].skill === req.body.skillName)
      return next(new AppError('skill aleardy added!', 400));
  }
  const applicantData = await updateModelData(req.user.additionalData, {
    skills: {
      skill: skillId.name,
      yearsExperiance: req.body.yearOfExperiance
    }
  });
  res.status(200).json(applicantData);
});

exports.deleteSkills = catchAsync(async (req, res, next) => {
  const skillId = await Skill.findOne({ name: req.body.skillName });
  if (!skillId) return next(new AppError('This is not a skill!', 400));

  let skills = await ApplicantData.findById(req.user.additionalData);
  skills = skills.skills;
  for (let i = 0; i < skills.length; i++) {
    if (skills[i].skill === req.body.skillName) {
      skills.splice(i, 1);
      break;
    }
  }

  const applicantData = await ApplicantData.findByIdAndUpdate(
    { _id: req.user.additionalData },
    {
      skills
    },
    { new: true, runValidators: true }
  );
  res.status(202).json(applicantData);
});
exports.updateCategories = catchAsync(async (req, res, next) => {
  const categoryId = await Category.findOne({ name: req.body.categoryName });
  if (!categoryId) return next(new AppError('This is not a  category!', 400));
  let categories = await ApplicantData.findById(req.user.additionalData);
  categories = categories.categories;
  for (let i = 0; i < categories.length; i++) {
    if (categories[i].category === req.body.categoryName)
      return next(new AppError('category aleardy added!', 400));
  }
  const applicantData = await updateModelData(req.user.additionalData, {
    categories: {
      category: categoryId.name
    }
  });
  res.status(204).json(applicantData);
});

exports.deleteCategories = catchAsync(async (req, res, next) => {
  const categoryId = await Category.findOne({ name: req.body.categoryName });
  if (!categoryId) return next(new AppError('This is not a  category!', 400));

  let categories = await ApplicantData.findById(req.user.additionalData);
  categories = categories.categories;
  for (let i = 0; i < categories.length; i++) {
    if (categories[i].category === req.body.categoryName) {
      categories.splice(i, 1);
      break;
    }
  }

  const applicantData = await ApplicantData.findByIdAndUpdate(
    { _id: req.user.additionalData },
    {
      categories
    },
    { new: true, runValidators: true }
  );
  res.status(202).json(applicantData);
});

exports.updateLanguages = catchAsync(async (req, res, next) => {
  const languageId = await Language.findOne({ name: req.body.languageName });
  if (!languageId) return next(new AppError('This is not a language!', 400));
  let languages = await ApplicantData.findById(req.user.additionalData);
  languages = languages.languages;
  for (let i = 0; i < languages.length; i++) {
    if (languages[i].language === req.body.languageName)
      return next(new AppError('language aleardy added!', 400));
  }
  const applicantData = await updateModelData(req.user.additionalData, {
    languages: {
      language: languageId.name,
      Reading: req.body.Reading,
      Writing: req.body.Writing,
      Listening: req.body.Listening,
      Speaking: req.body.Speaking
    }
  });

  res.status(204).json(applicantData);
});

exports.deleteLanguages = catchAsync(async (req, res, next) => {
  const languageId = await Language.findOne({ name: req.body.languageName });
  if (!languageId) return next(new AppError('This is not a language!', 400));
  let languages = await ApplicantData.findById(req.user.additionalData);
  languages = languages.languages;
  for (let i = 0; i < languages.length; i++) {
    if (languages[i].language === req.body.languageName);
    {
      languages.splice(i, 1);
      break;
    }
  }

  const applicantData = await ApplicantData.findByIdAndUpdate(
    { _id: req.user.additionalData },
    {
      languages
    },
    { new: true, runValidators: true }
  );
  res.status(202).json(applicantData);
});

exports.updateSalary = catchAsync(async (req, res, next) => {
  const applicantData = await ApplicantData.findByIdAndUpdate(
    req.user.additionalData,
    {
      salary: req.body.salary
    },
    { new: true, runValidators: true }
  );
  res.status(204).json(applicantData);
});
//todo
exports.updateOnlinePresence = catchAsync(async (req, res, next) => {
  const applicantData = await ApplicantData.findByIdAndUpdate(
    req.user.additionalData,
    {
      onlinePresence: {
        ..._.pick(req.body, [
          'linkedIn',
          'facebook',
          'twitter',
          'behance',
          'instagram',
          'gitHub',
          'stackOverflow',
          'youTube',
          'blog',
          'website',
          'other'
        ])
      }
    },
    { new: true, runValidators: true }
  );
  res.status(204).json(applicantData);
});

exports.updateJobTitles = catchAsync(async (req, res, next) => {
  const jobTitleId = await JobTitle.findOne({ name: req.body.jobTitleName });
  if (!jobTitleId) return next(new AppError('This is not a job Title!', 400));
  let jobTitles = await ApplicantData.findById(req.user.additionalData);
  jobTitles = jobTitles.jobTitles;
  for (let i = 0; i < jobTitles.length; i++) {
    if (jobTitles[i].jobTitle === req.body.jobTitleName)
      return next(new AppError('job Title aleardy added!', 400));
  }
  const applicantData = await updateModelData(req.user.additionalData, {
    jobTitles: {
      jobTitle: jobTitleId.name
    }
  });

  res.status(204).json(applicantData);
});
exports.deleteJobTitles = catchAsync(async (req, res, next) => {
  const jobTitleId = await JobTitle.findOne({ name: req.body.jobTitleName });
  if (!jobTitleId) return next(new AppError('This is not a job Title!', 400));
  let jobTitles = await ApplicantData.findById(req.user.additionalData);
  jobTitles = jobTitles.jobTitles;
  for (let i = 0; i < jobTitles.length; i++) {
    if (jobTitles[i].jobTitle === req.body.jobTitleName) {
      jobTitles.splice(i, 1);
      break;
    }
  }
  const applicantData = await ApplicantData.findByIdAndUpdate(
    { _id: req.user.additionalData },
    {
      jobTitles
    },
    { new: true, runValidators: true }
  );
  res.status(202).json(applicantData);
});

async function updateModelData (id, object) {
  const applicantData = await ApplicantData.findByIdAndUpdate(
    { _id: id },
    {
      $push: object
    },
    { new: true, runValidators: true }
  );
  return applicantData;
}
exports.getSkills = factory.getAll(Skill);

exports.searchSkills = catchAsync(async (req, res, next) => {
  const offset = req.query.offset * 1 || 0;
  const limit = req.query.limit * 1 || 16;
  const keyword = req.params.keyword;
  const skills = await exports.getSearchQuery(
    'skills',
    {},
    keyword,
    limit,
    offset
  );
  res.status(200).json(skills);
});
exports.searchJobTitles = catchAsync(async (req, res, next) => {
  const offset = req.query.offset * 1 || 0;
  const limit = req.query.limit * 1 || 16;
  const keyword = req.params.keyword;
  const jobTitles = await exports.getSearchQuery(
    'jobTitles',
    {},
    keyword,
    limit,
    offset
  );
  res.status(200).json(jobTitles);
});
exports.searchCategories = catchAsync(async (req, res, next) => {
  const offset = req.query.offset * 1 || 0;
  const limit = req.query.limit * 1 || 16;
  const keyword = req.params.keyword;
  const jobTitles = await exports.getSearchQuery(
    'Categories',
    {},
    keyword,
    limit,
    offset
  );
  res.status(200).json(jobTitles);
});

/**
 * function to get the search query for any model providing the keyword to be searched
 * @param {String} type - the model name of the collection to be searched
 * @param {Object} additionalConditions - any additional query conditions to be applied in the query
 * @param {String} keyword - the item name or part of its name
 * @param {Number} limit - maximum number of documents returned from the query
 * @param {Number} offset - index of first element in the response
 * @param {Object} popOptions - object contains what fields to be populated in the returned document
 * @returns {Query}
 */

exports.getSearchQuery = async function getSearchQuery (
  type,
  additionalConditions,
  keyword,
  limit,
  offset,
  popOptions
) {
  const Model = getModel[type];
  if (!Model) return null;
  let query = Model.find({
    name: { $regex: keyword, $options: 'i' },
    ...additionalConditions
  })
    .limit(limit)
    .skip(offset);
  if (popOptions) query = query.populate(popOptions);
  return query;
};

const getModel = {
  skills: Skill,
  jobTitles: JobTitle,
  Categories: Category
};
