import React, { Component } from 'react';
import Client from 'shopify-buy';
import Button from '@material-ui/core/Button';
import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storeName: '',
      productList: [],
      checkoutId: '',
      checkoutUrl: '',
      itemsAdded: []
    };

    this.addItem = this.addItem.bind(this);
    this.checkoutItems = this.checkoutItems.bind(this);
  }

  client = '';

  componentDidMount() {
    this.client = Client.buildClient({
      domain: 'cliche-company.myshopify.com',
      storefrontAccessToken: '0503cf49b7c1f12276ced973315a9a6d'
    });

    this.client.shop.fetchInfo().then(x => {
      this.setState({ storeName: x.name });
    });

    this.client.product.fetchAll().then(products => {
      console.log(products);
      this.setState({
        productList: products
      });
    });

    this.initCheckout();
  }

  initCheckout() {
    this.client.checkout.create().then(checkout => {
      // Do something with the checkout
      this.setState({
        checkoutId: checkout.id,
        checkoutUrl: checkout.webUrl
      });
    });
  }

  addItem(variantId) {
    const lineItemsToAdd = [
      {
        variantId,
        quantity: 1
      }
    ];

    this.setState({
      itemsAdded: [...this.state.itemsAdded, variantId]
    });
    this.client.checkout
      .addLineItems(this.state.checkoutId, lineItemsToAdd)
      .then(checkout => {
        this.setState({
          checkoutUrl: checkout.webUrl
        });
      });
  }

  checkoutItems() {
    window.open(this.state.checkoutUrl);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">{this.state.storeName}</header>
        {this.state.productList.map(product => (
          <div key={product.id} className="product">
            <img src={product.images[0].src} className="product-img" />
            <span className="product-info">{product.title}</span>
            <Button
              variant="contained"
              color="primary"
              size="small"
              className="add-btn"
              onClick={() => {
                this.addItem(product.variants[0].id);
              }}
              disabled={this.state.itemsAdded.includes(product.variants[0].id)}
            >
              Add
            </Button>
          </div>
        ))}
        <Button
          variant="contained"
          color="primary"
          size="small"
          className="checkout-btn"
          onClick={this.checkoutItems}
        >
          Check out
        </Button>
      </div>
    );
  }
}
