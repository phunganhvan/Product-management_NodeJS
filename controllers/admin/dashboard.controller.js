const ProductCategory = require("../../models/product-category.model");
const Product = require("../../models/product.model");
const Account = require("../../models/account.model")
const User = require("../../models/users.model");
const BlogCategory = require("../../models/blog-category.model")
const Blog = require("../../models/blogs.model")
// [GET] /admin/dashboard 
module.exports.dashboard = async (req, res) => {
    // res.send("Trang tổng quan");

    const statistic = {
        categoryProduct: {
            total: 0,
            active: 0,
            inactive: 0,
            deleted: 0,
        },
        product: {
            total: 0,
            active: 0,
            inactive: 0,
            deleted: 0,
        },
        blog: {
            total: 0,
            active: 0,
            inactive: 0,
            deleted: 0,
        },
        categoryBlog: {
            total: 0,
            active: 0,
            inactive: 0,
            deleted: 0,
        },
        account: {
            total: 0,
            active: 0,
            inactive: 0,
            deleted: 0,
        },
        user: {
            total: 0,
            active: 0,
            inactive: 0,
            deleted: 0,
        },
    };
    // danh mục sản phẩm
    statistic.categoryProduct.total = await ProductCategory.countDocuments({
        deleted: false
    });
    statistic.categoryProduct.active = await ProductCategory.countDocuments({
        deleted: false,
        status: "active"
    });
    statistic.categoryProduct.inactive = await ProductCategory.countDocuments({
        deleted: false,
        status: "inactive"
    });
    statistic.categoryProduct.deleted = await ProductCategory.countDocuments({
        deleted: true
    })
    // danh sách sản phẩm
    statistic.product.total = await Product.countDocuments({
        deleted: false
    });
    statistic.product.active = await Product.countDocuments({
        deleted: false,
        status: "active"
    });
    statistic.product.inactive = await Product.countDocuments({
        deleted: false,
        status: "inactive"
    });
    statistic.product.deleted = await Product.countDocuments({
        deleted: true
    })
    // danh sách danh mục bài viết
    statistic.categoryBlog.total = await BlogCategory.countDocuments({
        deleted: false
    });
    statistic.categoryBlog.active = await BlogCategory.countDocuments({
        deleted: false,
        status: "active"
    });
    statistic.categoryBlog.inactive = await BlogCategory.countDocuments({
        deleted: false,
        status: "inactive"
    });
    statistic.categoryBlog.deleted = await BlogCategory.countDocuments({
        deleted: true
    })
    // danh sách bài viết
    statistic.blog.total = await Blog.countDocuments({
        deleted: false
    });
    statistic.blog.active = await Blog.countDocuments({
        deleted: false,
        status: "active"
    });
    statistic.blog.inactive = await Blog.countDocuments({
        deleted: false,
        status: "inactive"
    });
    statistic.blog.deleted = await Blog.countDocuments({
        deleted: true
    })
    // danh sách quản lý
    statistic.account.total = await Account.countDocuments({
        deleted: false
    });
    statistic.account.active = await Account.countDocuments({
        deleted: false,
        status: "active"
    });
    statistic.account.inactive = await Account.countDocuments({
        deleted: false,
        status: "inactive"
    });
    statistic.account.deleted = await Account.countDocuments({
        deleted: true
    })
    // danh sách người dùng
    statistic.user.total = await User.countDocuments({
        deleted: false
    });
    statistic.user.active = await User.countDocuments({
        deleted: false,
        status: "active"
    });
    statistic.user.inactive = await User.countDocuments({
        deleted: false,
        status: "inactive"
    });
    statistic.user.deleted = await User.countDocuments({
        deleted: true
    })
    
    res.render('admin/pages/dashboard/index', {
        pageTitle: "Admin",
        statistic: statistic

    });
}