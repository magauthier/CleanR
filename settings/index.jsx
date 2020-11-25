function Colors(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Color Settings</Text>}>
        <ColorSelect
          settingsKey="accentColor"
          colors={[
            {color: 'tomato'},
            {color: 'sandybrown'},
            {color: 'gold'},
            {color: 'aquamarine'},
            {color: 'deepskyblue'},
            {color: 'plum'},

            {color: '#3BF7DE'},
            {color: '#FFFFFF'},
            {color: '#4D86FF'},
            {color: '#8080FF'},
            {color: '#15B9ED'},
            {color: '#505050'},
            
            {color: '#303030'},
            {color: '#2CB574'},
            {color: '#134022'},
            {color: '#5B4CFF'},
            {color: '#8173FF'},
            {color: '#A0A0A0'},
            
            {color: '#72B314'},
            {color: '#5BE37D'},
            {color: '#FF752D'},
            {color: '#FFCC33'},
            {color: '#FF78B7'},
            {color: '#A51E7C'},
            
            {color: '#C658FB'},
            {color: '#FA4D61'},
            {color: '#7090B5'},
            {color: '#1B2C40'},
            {color: '#D828B8'},
            {color: '#F0A500'},
          ]}
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(Colors);