<?php
namespace Design\DesignBundle\Services\PdfExterno3;
use Design\DesignBundle\Services\PdfExterno3\PhpGenPdfBdPdo as BdPdo;
class PhpGenPdfDb {
    private static $instancia = "";
    public function __construct( $db,$name="app") {  
        if (self::$instancia == "") {
            self::$instancia = array();
        }
        if (! isset( self::$instancia[$name] ) ) {
            if ( get_class ($db) == "Doctrine\DBAL\Connection" ) {
                self::$instancia[$name] = new BdPdo($db);
            } else{
                self::$instancia[$name] = new BdPdo($db->getConnection());
            }
        }
        return self::$instancia[$name];
    }
    /**
     * @return BdPdo
     */
    public static function getConexion($connName="app") {
        if ($connName=="") $connName="app";
        return self::$instancia[$connName];
    }
}
?>