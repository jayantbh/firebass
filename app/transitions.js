export default function(){
  this.transition(
    this.hasClass('sidebar-toggle'),
    this.toValue(true),
    this.use('toRight', { duration: 200 }),
    this.reverse('toLeft', { duration: 200 })
  );
}
