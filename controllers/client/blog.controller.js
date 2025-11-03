const Blog = require("../../models/blogs.model");
const BlogCategory = require("../../models/blog-category.model");
const Account = require("../../models/account.model");
const getSubCategoryHelper = require("../../helpers/products-category")
// /blogs
module.exports.index = async (req, res) => {
    const blogs = await Blog.find({
        status: "active",
        deleted: false,
    }).sort({ position: "desc" });

    // for (let blog of blogs) {
    //     const category = await BlogCategory.findOne({
    //         _id: blog.blog_category_id
    //     }).select('title id');
    //     blog.category = category.title;
    //     // console.log(category);
    // }
    res.render('client/pages/blog/index', {
        titlePage: "Danh sách bài viết",
        blogs: blogs,
    });
}

// /blogs/detail/:slugBlog
module.exports.detail = async (req, res) => {
    try {
        const slug = req.params.slugBlog;
        const find = {
            deleted: false,
            status: "active",
            slug: slug
        };
        const blog = await Blog.findOne(find);
        const author = await Account.findOne({
            _id: blog.createdBy.accountId
        }).select("fullName id");
        blog.author = author.fullName
        if (blog.blog_category_id) {
            const category = await BlogCategory.findOne({
                _id: blog.blog_category_id,
                status: "active",
                deleted: false
            })
            if (category) {
                blog.category = category;
            }

            var listSub = await getSubCategoryHelper.getSubCategory(category.id)
            var listSubCategoryId = listSub.map(item => item.id)
            var blogs = await Blog.find({
                deleted: false,
                blog_category_id: { $in: [category.id, ...listSubCategoryId] }
            }).sort({ position: "desc" })
        }

        // console.log(product.status)
        res.render('client/pages/blog/detail', {
            titlePage: "Chi tiết bài viết",
            blog: blog,
            related: blogs
        })
    } catch (error) {
        res.redirect('/blogs');
    }
}

// /blogs/:slugBlog
module.exports.category = async (req, res) => {
    const slug = req.params.slugBlog;
    const category = await BlogCategory.findOne({
        slug: slug,
        status: "active",
        deleted: false
    });



    const listSub = await getSubCategoryHelper.getSubCategory(category.id)
    const listSubCategoryId = listSub.map(item => item.id)
    const blogs = await Blog.find({
        deleted: false,
        blog_category_id: { $in: [category.id, ...listSubCategoryId] }
    }).sort({ position: "desc" })

    // console.log(category)
    res.render("client/pages/blog/index", {
        titlePage: category.title,
        blogs: blogs
    })
}