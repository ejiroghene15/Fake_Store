import { useEffect, useState } from "react";

const API = "https://fakestoreapi.com/products";

const Cart = () => {
	let [product, setProduct] = useState([]);
	let [cart, setCart] = useState([]);

	useEffect(() => {
		fetch(API)
			.then((res) => res.json())
			.then((products) => {
				setProduct(products);
				setCart(products);
			})
			.catch((err) => console.log(err));
	});

	let addToCart = (e) => {
		e.preventDefault();
		let p_name = e.target.product_name.value;
		let p_category = e.target.product_category.value;
		let p_description = e.target.product_description.value;
		let p_image = e.target.product_image.value;
		let p_price = e.target.product_price.value;
		let check_product_exist = localStorage.getItem(p_name);
		if (check_product_exist == null) {
			localStorage.setItem(
				p_name,
				JSON.stringify({
					p_name,
					p_category,
					p_description,
					p_image,
					p_price,
					quantity: 1,
				})
			);
		}
		// console.log(e.target.product_name.value);
	};

	let deleteFromCart = (product) => localStorage.removeItem(`${product}`);

	let updateProductQuantity = (name, qty) => {
		let product = JSON.parse(localStorage.getItem(name));
		product.quantity = qty;
		localStorage.setItem(`${name}`, JSON.stringify(product));
	};

	return (
		<main className="store-container">
			<section className="product shadow-sm">
				<div className="card">
					<div className="card-header">
						<h5 className="card-title m-0 py-1">Products</h5>
					</div>
					<div className="card-body">
						{product.length > 0 ? (
							product.map((item, key) => (
								<div className="media mb-5" key={key}>
									<img
										src={item.image}
										className="mr-4 ml-2 product-image"
										alt={item.title}
									/>
									<div className="media-body">
										<h5 className="mt-0">
											<span className="d-block mb-3">
												<h6 className="text-capitalize text-info font-weight-bolder m-0">
													{item.category}
												</h6>
											</span>
											<span className="d-flex justify-content-between">
												<span className="product-title">{item.title}</span>
												<small>${item.price}</small>
											</span>
										</h5>
										<p>{item.description}</p>
										<form className="add_to_cart" onSubmit={addToCart}>
											<input
												type="hidden"
												name="product_name"
												value={item.title}
											/>
											<input
												type="hidden"
												name="product_category"
												value={item.category}
											/>
											<input
												type="hidden"
												name="product_image"
												value={item.image}
											/>
											<input
												type="hidden"
												name="product_description"
												value={item.description}
											/>
											<input
												type="hidden"
												name="product_price"
												value={item.price}
											/>

											{localStorage.getItem(item.title) != null ? (
												<button className="btn btn-sm btn-dark" disabled>
													Added
												</button>
											) : (
												<button className="btn btn-sm btn-dark">
													Add to Cart
												</button>
											)}
										</form>
									</div>
								</div>
							))
						) : (
							<div>Loading products...</div>
						)}
					</div>
				</div>
			</section>

			<aside className="cart">
				<div className="card">
					<div className="card-header">
						<h5 className="card-title m-0 py-1">My Cart</h5>
					</div>

					{cart.every(
						(item) => localStorage.getItem(`${item.title}`) === undefined
					) ? (
						<span className="p-3">Cart is empty</span>
					) : (
						<div>
							<div className="card-body">
								{cart
									.filter(
										(item) => localStorage.getItem(`${item.title}`) != null
									)
									.map((item, key) => {
										let { quantity } = JSON.parse(
											localStorage.getItem(`${item.title}`)
										);
										return (
											<div className="media mb-5" key={key}>
												<img
													src={item.image}
													className="mr-4 ml-2 product-image"
													alt={item.title}
												/>
												<div className="media-body">
													<h5 className="mt-0">
														<span className="d-flex justify-content-between align-items-baseline  mb-2">
															<h6 className="text-capitalize text-info font-weight-bolder m-0">
																{item.category}
															</h6>

															<button
																className="btn btn-sm btn-danger"
																onClick={() => deleteFromCart(item.title)}
															>
																<i className="bx bxs-trash-alt"></i>
															</button>
														</span>

														<span className="product-title">{item.title}</span>
													</h5>

													<div className="d-flex justify-content-between">
														<div
															className="input-group mb-3"
															style={{ flex: ".3" }}
														>
															<div className="input-group-prepend">
																<span className="input-group-text">Qty</span>
															</div>
															<input
																type="number"
																min="1"
																value={quantity}
																className="form-control"
																onChange={(e) =>
																	updateProductQuantity(
																		item.title,
																		e.target.value
																	)
																}
															/>
														</div>
														<small>
															${Number(item.price * quantity).toFixed(2)}
														</small>
													</div>
												</div>
											</div>
										);
									})}
							</div>
							<div className="card-footer d-flex justify-content-between align-items-baseline">
								<button
									class="btn btn-sm btn-danger"
									onClick={() => localStorage.clear()}
								>
									Empty Cart
								</button>
								<div>
									<h6>
										Total: $
										{cart
											.filter(
												(item) => localStorage.getItem(`${item.title}`) != null
											)
											.map((item) =>
												JSON.parse(localStorage.getItem(`${item.title}`))
											)
											.reduce(
												(accumulator, item) =>
													accumulator + item.p_price * item.quantity,
												0
											)
											.toFixed(2)}
									</h6>
									<button
										class="btn btn-sm btn-success float-right"
										// onClick={() => localStorage.clear()}
									>
										Check Out
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</aside>
		</main>
	);
};

export default Cart;
